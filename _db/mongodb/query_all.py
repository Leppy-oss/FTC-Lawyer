import os

from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain import hub
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain.retrievers import EnsembleRetriever
from langchain_groq import ChatGroq
from init_mongo import init_mongo, init_retriever

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
    mongo_client = init_mongo()
    
    print('Initializing vectorstores')
    rss_retriever = init_retriever(mongo_client, os.environ['RSS_DB'], str(season), os.environ['RSS_INDEX_BASE'] + str(season), embeddings)
    gm1_retriever = init_retriever(mongo_client, os.environ['GM1_INDEX'], 'index', os.environ['GM1_INDEX'], embeddings)
    gm2_retriever = init_retriever(mongo_client, os.environ['GM2_DB'], str(season), os.environ['GM2_INDEX_BASE'] + str(season), embeddings)

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