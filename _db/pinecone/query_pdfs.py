import os

from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain import hub
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain.retrievers import EnsembleRetriever

from langchain_groq import ChatGroq

from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    temperature=0,
    model='llama-3.1-8b-instant'
)

embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
)

print('Initializing vectorstores')
gm1_store = PineconeVectorStore(index_name=os.environ['GM1_INDEX'], embedding=embeddings)
gm1_retriever = gm1_store.as_retriever()

gm2_store = PineconeVectorStore(index_name=os.environ['GM2_INDEX_BASE'] + '2023', embedding=embeddings)
gm2_retriever = gm2_store.as_retriever()

prompt = hub.pull('rlm/rag-prompt')

chain = (
    {
        'context': EnsembleRetriever(retrievers=[gm1_retriever, gm2_retriever]),
        'question': RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

print('Invoking RAG chain')
print(chain.invoke('What is a mosaic?'))