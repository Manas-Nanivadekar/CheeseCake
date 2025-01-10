import os
from typing import List, Dict, Union
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
import json
from bs4 import BeautifulSoup
import requests


class RAGProcessor:
    def __init__(self, openai_api_key: str, brave_api_key: str = None):
        """Initialize the RAG processor with necessary API keys"""
        self.openai_api_key = openai_api_key
        self.brave_api_key = brave_api_key
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.llm = ChatOpenAI(
            temperature=0.7, model_name="gpt-3.5-turbo", openai_api_key=openai_api_key
        )

        # Initialize question generation prompt
        self.question_template = """
        You are an expert at generating insightful questions based on content.
        Given the following text, generate {num_questions} relevant and diverse questions that would help someone understand the key points.
        
        Text: {context}
        
        Generate exactly {num_questions} questions, one per line.
        Each question should focus on a different aspect of the content.
        """

        self.question_prompt = PromptTemplate(
            input_variables=["context", "num_questions"],
            template=self.question_template,
        )

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
            url,
            verify_ssl=False,  # Add this if you encounter SSL verification issues
            header_template={"User-Agent": "Mozilla/5.0"},
        )
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        texts = text_splitter.split_documents(documents)
        vectorstore = FAISS.from_documents(texts, self.embeddings)
        return vectorstore

    def generate_questions(
        self, vectorstore: FAISS, num_questions: int = 5
    ) -> List[str]:
        """Generate questions based on the document content"""
        question_chain = LLMChain(llm=self.llm, prompt=self.question_prompt)

        # Sample some documents from the vectorstore
        sample_docs = vectorstore.similarity_search("", k=3)
        context = " ".join([doc.page_content for doc in sample_docs])

        # Generate questions
        questions_text = question_chain.run(
            context=context, num_questions=num_questions
        )

        # Clean and format questions
        questions = [
            q.strip() for q in questions_text.split("\n") if q.strip() and "?" in q
        ]

        return questions[:num_questions]

    def generate_answers(self, vectorstore: FAISS, questions: List[str]) -> List[Dict]:
        """Generate answers for the questions using RAG"""
        qa_results = []

        answer_template = """
        Based on the following context, provide a comprehensive and accurate answer to the question.
        If the context doesn't contain enough information, say so.
        
        Context: {context}
        
        Question: {question}
        
        Answer:
        """

        answer_prompt = PromptTemplate(
            input_variables=["context", "question"], template=answer_template
        )

        answer_chain = LLMChain(llm=self.llm, prompt=answer_prompt)

        for question in questions:
            # Search relevant documents
            docs = vectorstore.similarity_search(question, k=3)
            context = " ".join([doc.page_content for doc in docs])

            # Generate answer
            answer = answer_chain.run(context=context, question=question)

            qa_results.append({"question": question, "answer": answer.strip()})

        return qa_results

    def process_input(self, input_source: str, is_url: bool = False) -> Dict:
        """Main method to process either document or website"""
        # Process input and create vectorstore
        if is_url:
            vectorstore = self.process_website(input_source)
        else:
            vectorstore = self.process_document(input_source)

        # Generate questions
        questions = self.generate_questions(vectorstore)

        # Generate answers
        qa_pairs = self.generate_answers(vectorstore, questions)

        # Create output JSON
        output = {
            "source": input_source,
            "type": "website" if is_url else "document",
            "qa_pairs": qa_pairs,
        }

        return output

    def save_output(self, output: Dict, output_file: str):
        """Save the output to a JSON file"""
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)


def main():

    openai_api_key = openai_api_key
    # Get API key from environment variable
    # openai_api_key = os.getenv("OPENAI_API_KEY")
    # if not openai_api_key:
    #     raise ValueError("Please set OPENAI_API_KEY environment variable")

    # Initialize processor
    processor = RAGProcessor(openai_api_key=openai_api_key)

    # # Example: Process a PDF document
    # try:
    #     doc_output = processor.process_input("sample.pdf")
    #     processor.save_output(doc_output, "document_qa.json")
    #     print("Successfully processed document and saved results")
    # except Exception as e:
    #     print(f"Error processing document: {e}")

    # Example: Process a website
    try:
        website_output = processor.process_input("https://lisaapp.in/", is_url=True)
        processor.save_output(website_output, "website_qa.json")
        print("Successfully processed website and saved results")
    except Exception as e:
        print(f"Error processing website: {e}")


if __name__ == "__main__":
    main()
