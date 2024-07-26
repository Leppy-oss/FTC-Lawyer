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

def query(inp):
    llm = ChatGroq(
        temperature=0,
        model='llama-3.1-70b-versatile'
    )
    
    print('Initializing vectorstore')
    retriever = init_retriever()

    prompt = hub.pull('rlm/rag-prompt')

    chain = (
        {
            'context': retriever,
            'question': RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    
    print('Invoking RAG chain')
    return chain.invoke(inp)
    
if __name__ == '__main__':
    print(query('Is it allowed to use a USB battery to power the hubs'))