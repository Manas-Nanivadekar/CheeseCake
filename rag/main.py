import os
from typing import List, Dict, Union
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from operator import itemgetter
from langchain.schema.runnable import RunnableMap
import json
from bs4 import BeautifulSoup
import requests


class QuestionGenerator:
    def __init__(self, llm):
        self.llm = llm

    def _clean_json_string(self, s: str) -> str:
        """Clean the JSON string to ensure it's valid"""
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
        """Initialize the RAG processor with necessary API keys"""
        self.openai_api_key = openai_api_key
        self.brave_api_key = brave_api_key
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.llm = ChatOpenAI(
            temperature=0.7,
            model="gpt-4-0125-preview",  # Using GPT-4 for better quality
            openai_api_key=openai_api_key,
        )
        self.question_generator = QuestionGenerator(self.llm)

    def process_document(self, file_path: str) -> FAISS:
        """Process uploaded document and create FAISS store"""
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        else:
            raise ValueError("Unsupported file format")

        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        texts = text_splitter.split_documents(documents)
        vectorstore = FAISS.from_documents(texts, self.embeddings)
        return vectorstore

    def process_website(self, url: str) -> FAISS:
        """Process website content and create FAISS store"""
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

    def generate_questions(self, vectorstore: FAISS) -> Dict:
        """Generate structured questions based on the document content"""
        # Sample some documents from the vectorstore
        sample_docs = vectorstore.similarity_search("", k=3)
        context = " ".join([doc.page_content for doc in sample_docs])

        # Generate different types of questions
        questions = {
            "mcq": self.question_generator.generate_mcq(context),
            "true_false": self.question_generator.generate_true_false(context),
            "fill_blanks": self.question_generator.generate_fill_blanks(context),
            "ranking": self.question_generator.generate_ranking(context),
        }

        return questions

    def process_input(self, input_source: str, is_url: bool = False) -> Dict:
        """Main method to process either document or website"""
        try:
            # Process input and create vectorstore
            if is_url:
                vectorstore = self.process_website(input_source)
            else:
                vectorstore = self.process_document(input_source)

            # Generate questions
            questions = self.generate_questions(vectorstore)

            # Create output JSON
            output = {
                "source": input_source,
                "type": "website" if is_url else "document",
                "questions": questions,
            }

            return output
        except Exception as e:
            print(f"Error in process_input: {str(e)}")
            raise

    def save_output(self, output: Dict, output_file: str):
        """Save the output to a JSON file"""
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(output, f, indent=2, ensure_ascii=False)
            print(f"Successfully saved output to {output_file}")
        except Exception as e:
            print(f"Error saving output: {str(e)}")
            raise


def main():
    # Load OpenAI API key from environment variable
    openai_api_key = os.getenv("OPENAI_API_KEY")
    # Initialize processor
    processor = RAGProcessor(openai_api_key=openai_api_key)

    # Process a website
    try:
        website_url = ""  # Replace with your target URL
        website_output = processor.process_input(website_url, is_url=True)
        processor.save_output(website_output, "website_qa.json")
        print("Successfully processed website and saved results")
    except Exception as e:
        print(f"Error processing website: {str(e)}")

    # # Process a PDF document
    # try:
    #     pdf_path = "sample.pdf"  # Replace with your PDF file path
    #     doc_output = processor.process_input(pdf_path)
    #     processor.save_output(doc_output, "document_qa.json")
    #     print("Successfully processed document and saved results")
    # except Exception as e:
    #     print(f"Error processing document: {str(e)}")


if __name__ == "__main__":
    main()
