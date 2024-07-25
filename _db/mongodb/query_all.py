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

def query(season, inp):
    llm = ChatGroq(
        temperature=0,
        model='llama-3.1-8b-instant'
    )

    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
    )

    print('Initializing vectorstores')
    gm1_retriever = PineconeVectorStore(index_name=os.environ['GM1_INDEX'], embedding=embeddings).as_retriever()
    gm2_retriever = PineconeVectorStore(index_name=os.environ['GM2_INDEX_BASE'] + str(season), embedding=embeddings).as_retriever()
    rss_retriever = PineconeVectorStore(index_name=os.environ['RSS_INDEX_BASE'] + str(season), embedding=embeddings).as_retriever()

    prompt = hub.pull('rlm/rag-prompt')

    chain = (
        {
            'context': EnsembleRetriever(retrievers=[gm1_retriever, gm2_retriever, rss_retriever]),
            'question': RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    print('Invoking RAG chain')
    return chain.invoke(inp)
    
if __name__ == '__main__':
    print(query(2023, 'Is it legal to remove a motor mount from a DC motor?'))