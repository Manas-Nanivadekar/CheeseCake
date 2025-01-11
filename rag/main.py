import os
import tempfile
import requests
import urllib3
import time
import datetime
from urllib.parse import urlparse
import boto3
from botocore import UNSIGNED
from botocore.config import Config
from typing import List, Dict, Union
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
import json
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

app = FastAPI(title="RAG Question Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Suppress SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class WebProcessor:
    @staticmethod
    def process_url(url: str, headers: Dict = None) -> str:
        """Process website content with retry logic"""
        default_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        headers = headers or default_headers

        session = requests.Session()
        adapter = requests.adapters.HTTPAdapter(
            max_retries=urllib3.Retry(
                total=3, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504]
            )
        )
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        response = session.get(url, headers=headers, verify=False, timeout=30)
        response.raise_for_status()
        return response.text


class S3PDFProcessor:
    @staticmethod
    def is_s3_url(url: str) -> bool:
        """Check if the given URL is an S3 URL"""
        parsed = urlparse(url)
        return "s3.amazonaws.com" in parsed.netloc or parsed.scheme == "s3"

    @staticmethod
    def download_from_s3(url: str, max_retries: int = 3) -> str:
        """Download PDF from S3 public bucket and save to temp file with retry logic"""
        temp_file = None
        for attempt in range(max_retries):
            try:
                # Create a temporary file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

                if url.startswith("s3://"):
                    # Handle s3:// protocol
                    s3 = boto3.client(
                        "s3",
                        config=Config(
                            signature_version=UNSIGNED,
                            retries={"max_attempts": 3, "mode": "adaptive"},
                        ),
                    )
                    parsed = urlparse(url)
                    bucket = parsed.netloc
                    key = parsed.path.lstrip("/")
                    s3.download_file(bucket, key, temp_file.name)
                else:
                    # Handle https:// URLs with chunked downloading
                    session = requests.Session()
                    adapter = requests.adapters.HTTPAdapter(
                        max_retries=urllib3.Retry(
                            total=5,
                            backoff_factor=0.5,
                            status_forcelist=[500, 502, 503, 504],
                        ),
                        pool_connections=10,
                        pool_maxsize=10,
                    )
                    session.mount("http://", adapter)
                    session.mount("https://", adapter)

                    # First, make a HEAD request to get the file size
                    head_response = session.head(
                        url,
                        verify=False,
                        headers={"User-Agent": "Mozilla/5.0"},
                        timeout=30,
                    )
                    total_size = int(head_response.headers.get("content-length", 0))

                    # Download in chunks with range headers
                    chunk_size = 1024 * 1024  # 1MB
                    downloaded_size = 0

                    with open(temp_file.name, "wb") as f:
                        while downloaded_size < total_size:
                            end_byte = min(
                                downloaded_size + chunk_size - 1, total_size - 1
                            )
                            headers = {
                                "User-Agent": "Mozilla/5.0",
                                "Range": f"bytes={downloaded_size}-{end_byte}",
                            }

                            # Download chunk with timeout and retries
                            for retry in range(3):
                                try:
                                    response = session.get(
                                        url,
                                        headers=headers,
                                        stream=True,
                                        verify=False,
                                        timeout=(
                                            30,
                                            30,
                                        ),  # (connect timeout, read timeout)
                                    )
                                    response.raise_for_status()

                                    # Write chunk to file
                                    for data in response.iter_content(chunk_size=8192):
                                        if data:
                                            f.write(data)
                                            f.flush()
                                            os.fsync(f.fileno())

                                    downloaded_size = end_byte + 1
                                    print(
                                        f"Downloaded {downloaded_size}/{total_size} bytes"
                                    )
                                    break
                                except Exception as chunk_error:
                                    if retry == 2:  # Last retry
                                        raise Exception(
                                            f"Failed to download chunk: {str(chunk_error)}"
                                        )
                                    print(
                                        f"Retry {retry + 1} for chunk download due to: {str(chunk_error)}"
                                    )
                                    time.sleep(1 * (retry + 1))  # Exponential backoff

                # Verify file was downloaded completely
                if os.path.getsize(temp_file.name) > 0:
                    return temp_file.name
                else:
                    raise Exception("Downloaded file is empty")

            except Exception as e:
                print(f"Download attempt {attempt + 1} failed: {str(e)}")
                if temp_file and os.path.exists(temp_file.name):
                    os.unlink(temp_file.name)
                if attempt == max_retries - 1:
                    raise Exception(
                        f"Failed to download after {max_retries} attempts: {str(e)}"
                    )
                continue


class QuestionGenerator:
    def __init__(self, llm):
        self.llm = llm

    def _clean_json_string(self, s: str) -> str:
        """Clean the JSON string to ensure it's valid"""
        # Find the first '{' and last '}'
        start = s.find("{")
        end = s.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("No valid JSON object found in response")
        return s[start:end]

    def generate_mcq(self, context: str) -> Dict:
        mcq_template = """
        Based on the following context, first create a brief learning context that explains the key concept,
        then generate an MCQ question that tests understanding of this concept.
        
        Context: {context}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "learning_context": "A brief explanation of the key concept that will be tested (2-3 sentences)",
            "question": "What feature of [Product/Technology] helps in [specific function]?",
            "options": {{
                "A": "Option 1",
                "B": "Option 2",
                "C": "Option 3",
                "D": "Option 4"
            }},
            "correct_answer": "A",
            "explanation": "Detailed explanation of why this is the correct answer"
        }}
        """
        mcq_prompt = PromptTemplate(input_variables=["context"], template=mcq_template)
        chain = mcq_prompt | self.llm
        response = chain.invoke({"context": context})
        try:
            cleaned_response = self._clean_json_string(response.content)
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing MCQ response: {e}")
            return {
                "learning_context": "Error generating learning context",
                "question": "Error generating MCQ question",
                "options": {"A": "Error", "B": "Error", "C": "Error", "D": "Error"},
                "correct_answer": "A",
                "explanation": "Error occurred during question generation",
            }

    def generate_true_false(self, context: str) -> List[Dict]:
        tf_template = """
        Based on the following context, first create a brief learning context that explains the key concepts,
        then generate 2 True/False questions that test understanding of these concepts.
        
        Context: {context}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "learning_context": "A brief explanation of the key concepts that will be tested (2-3 sentences)",
            "questions": [
                {{
                    "statement": "Statement 1",
                    "answer": true,
                    "explanation": "Why this is true/false"
                }},
                {{
                    "statement": "Statement 2",
                    "answer": false,
                    "explanation": "Why this is true/false"
                }}
            ]
        }}
        """
        tf_prompt = PromptTemplate(input_variables=["context"], template=tf_template)
        chain = tf_prompt | self.llm
        response = chain.invoke({"context": context})
        try:
            cleaned_response = self._clean_json_string(response.content)
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing True/False response: {e}")
            return {
                "learning_context": "Error generating learning context",
                "questions": [
                    {
                        "statement": "Error generating true/false question 1",
                        "answer": True,
                        "explanation": "Error occurred",
                    },
                    {
                        "statement": "Error generating true/false question 2",
                        "answer": False,
                        "explanation": "Error occurred",
                    },
                ],
            }

    def generate_fill_blanks(self, context: str) -> Dict:
        blanks_template = """
        Based on the following context, first create a brief learning context that explains the key concept,
        then generate a fill-in-the-blanks question about product features or technology.
        
        Context: {context}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "learning_context": "A brief explanation of the key concept that will be tested (2-3 sentences)",
            "question": "The sentence with _____ and _____ as blanks",
            "answers": ["correct word 1", "correct word 2"],
            "explanation": "Explanation of why these are the correct answers"
        }}
        """
        blanks_prompt = PromptTemplate(
            input_variables=["context"], template=blanks_template
        )
        chain = blanks_prompt | self.llm
        response = chain.invoke({"context": context})
        try:
            cleaned_response = self._clean_json_string(response.content)
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing Fill in the blanks response: {e}")
            return {
                "learning_context": "Error generating learning context",
                "question": "Error generating fill in the blanks question",
                "answers": ["error", "error"],
                "explanation": "Error occurred during question generation",
            }

    def generate_ranking(self, context: str) -> Dict:
        ranking_template = """
        Based on the following context, first create a brief learning context that explains the process or concept,
        then create a scenario-based ranking question.
        
        Context: {context}
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "learning_context": "A brief explanation of the process or concept that will be tested (2-3 sentences)",
            "scenario": "Detailed scenario description",
            "question": "What is the correct order of steps to...?",
            "options": ["Step 1", "Step 2", "Step 3", "Step 4"],
            "correct_order": [3, 1, 4, 2],
            "explanation": "Explanation of why this is the correct order"
        }}
        """
        ranking_prompt = PromptTemplate(
            input_variables=["context"], template=ranking_template
        )
        chain = ranking_prompt | self.llm
        response = chain.invoke({"context": context})
        try:
            cleaned_response = self._clean_json_string(response.content)
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing Ranking response: {e}")
            return {
                "learning_context": "Error generating learning context",
                "scenario": "Error generating scenario",
                "question": "Error generating question",
                "options": ["Error 1", "Error 2", "Error 3", "Error 4"],
                "correct_order": [1, 2, 3, 4],
                "explanation": "Error occurred during question generation",
            }


class RAGProcessor:
    def __init__(self, openai_api_key: str, brave_api_key: str = None):
        self.openai_api_key = openai_api_key
        self.brave_api_key = brave_api_key
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.llm = ChatOpenAI(
            temperature=0.7, model="gpt-4-0125-preview", openai_api_key=openai_api_key
        )
        self.question_generator = QuestionGenerator(self.llm)

    def process_document(self, file_path: str) -> FAISS:
        """Process document from local path or S3 URL"""
        try:
            temp_file_path = None

            if S3PDFProcessor.is_s3_url(file_path):
                temp_file_path = S3PDFProcessor.download_from_s3(file_path)
                loader = PyPDFLoader(temp_file_path)
            else:
                if not file_path.endswith(".pdf"):
                    raise ValueError("Unsupported file format")
                loader = PyPDFLoader(file_path)

            try:
                documents = loader.load()
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000, chunk_overlap=200
                )
                texts = text_splitter.split_documents(documents)
                vectorstore = FAISS.from_documents(texts, self.embeddings)
                return vectorstore
            finally:
                if temp_file_path and os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)

        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")

    def process_website(self, url: str) -> FAISS:
        """Process website content and create FAISS store"""
        try:
            content = WebProcessor.process_url(url)
            loader = WebBaseLoader(
                url, verify_ssl=False, header_template={"User-Agent": "Mozilla/5.0"}
            )
            documents = loader.load()

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=200
            )
            texts = text_splitter.split_documents(documents)
            vectorstore = FAISS.from_documents(texts, self.embeddings)
            return vectorstore
        except Exception as e:
            raise Exception(f"Error processing website: {str(e)}")

    def generate_questions(self, vectorstore: FAISS) -> Dict:
        """Generate questions from vectorstore"""
        try:
            sample_docs = vectorstore.similarity_search("", k=3)
            context = " ".join([doc.page_content for doc in sample_docs])

            questions = {
                "mcq": self.question_generator.generate_mcq(context),
                "true_false": self.question_generator.generate_true_false(context),
                "fill_blanks": self.question_generator.generate_fill_blanks(context),
                "ranking": self.question_generator.generate_ranking(context),
            }

            return questions
        except Exception as e:
            raise Exception(f"Error generating questions: {str(e)}")

    def process_input(self, input_source: str, is_url: bool = False) -> Dict:
        """Process input and generate questions"""
        try:
            # Process input to create vectorstore
            if is_url and not S3PDFProcessor.is_s3_url(input_source):
                vectorstore = self.process_website(input_source)
            else:
                vectorstore = self.process_document(input_source)

            # Generate questions
            questions = self.generate_questions(vectorstore)

            # Create output (only include JSON-serializable data)
            output = {
                "source": input_source,
                "type": (
                    "website"
                    if (is_url and not S3PDFProcessor.is_s3_url(input_source))
                    else "document"
                ),
                "questions": questions,
                "processed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            }

            return output
        except Exception as e:
            print(f"Error in process_input: {str(e)}")
            raise

    def save_output(self, output: Dict, output_file: str):
        """Save output to JSON file"""
        try:
            # Ensure output is JSON serializable
            json_output = json.dumps(output, indent=2, ensure_ascii=False)

            with open(output_file, "w", encoding="utf-8") as f:
                f.write(json_output)
            print(f"Successfully saved output to {output_file}")
        except Exception as e:
            print(f"Error saving output: {str(e)}")
            raise


processor = RAGProcessor(
    openai_api_key="",
    brave_api_key="",
)


class URLInput(BaseModel):
    url: str


@app.post("/process/website")
async def process_website(input_data: URLInput):
    """
    Process a website URL and generate questions
    """
    try:
        output = processor.process_input(input_data.url, is_url=True)
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process/document")
async def process_document(file: UploadFile = File(...)):
    """
    Process an uploaded PDF document and generate questions
    """
    try:
        # Save uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        try:
            with open(temp_file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)

            # Process the document
            output = processor.process_input(temp_file_path)
            return output
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process/s3")
async def process_s3_document(input_data: URLInput):
    """
    Process a PDF document from an S3 URL
    """
    try:
        output = processor.process_input(input_data.url)
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":

    uvicorn.run(app, port=8000)
