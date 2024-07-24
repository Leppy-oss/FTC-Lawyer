import os

from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore

load_dotenv()

llm = ChatGroq(temperature=0, model='llama-3-8b-8192')

embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.environ['HF_API_KEY'], model_name='dunzhang/stella_en_1.5B_v5'
)

gm1 = PyMuPDFLoader('../res/gm1.pdf').load()
gm2 = PyMuPDFLoader('../res/gm2.pdf').load()

print('Loaded PDFS')

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(gm1 + gm2)
vectorstore = PineconeVectorStore(index_name='pdf', embedding=embeddings)
print('Vectorizing documents')
vectorstore.from_documents(splits, embedding=embeddings, index_name='pdf')
print('Successfully stored documents')