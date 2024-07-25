import os

from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain import hub
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from langchain_groq import ChatGroq

from dotenv import load_dotenv
from init_mongo import init_collection

load_dotenv()

def query(season, inp):
    llm = ChatGroq(
        temperature=0,
        model='llama-3.1-8b-instant'
    )

    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
    )
    
    collection = init_collection(os.environ['RSS_DB'], str(season))

    print('Initializing vectorstore')
    rss_retriever = MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embeddings,
        index_name=os.environ['RSS_INDEX_BASE'] + str(season)
    ).as_retriever(
        search_type='similarity',
        search_kwargs={'k': 25}
    )

    prompt = hub.pull('rlm/rag-prompt')

    chain = (
        {
            'context': rss_retriever,
            'question': RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    print('Invoking RAG chain')
    return chain.invoke(inp)
    
if __name__ == '__main__':
    print(query(2023, 'Summarize the given context information.'))