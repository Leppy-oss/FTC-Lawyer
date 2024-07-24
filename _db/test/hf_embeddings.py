from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
# from langchain.vectorstores import Chroma
from langchain import hub

load_dotenv()

llm = ChatGroq(temperature=0, model='llama-3-8b-8192')

embeddings = HuggingFaceEmbeddings(model_name = 'dunzhang/stella_en_1.5B_v5')

gm1 = PyMuPDFLoader('../res/gm1.pdf').load()
gm2 = PyMuPDFLoader('../res/gm2.pdf').load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(gm1 + gm2)
# vectorstore = Chroma