import os
from pymongo import MongoClient
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain.retrievers import EnsembleRetriever

def init_mongo():
    print('Connecting to MongoDB Atlas')
    return MongoClient(os.environ['MONGO_KEY'])

def init_collection(col_name, mongo_client=None):
    if mongo_client is None:
        mongo_client = init_mongo()
    return mongo_client[os.environ['DB_NAME']][col_name]

def init_vector_store(col_name, mongo_client=None, embeddings=None):
    collection = init_collection(col_name, mongo_client)
    if embeddings is None:
        embeddings = init_embeddings()
        
    return MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embeddings,
        index_name=col_name + os.environ['ISCPT']
    )

def init_retriever():
    mongo_client = init_mongo()
    retrievers = [
        init_vector_store(os.environ['GM1_COL'], mongo_client).as_retriever(),
        init_vector_store(os.environ['GM2_COL'], mongo_client).as_retriever(),
        init_vector_store(os.environ['RSS_COL'], mongo_client).as_retriever()
    ]
    return EnsembleRetriever(
        retrievers=retrievers,
        weights=[0.4, 0.4, 0.2]
    )
    
def init_embeddings():
    return HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-base-en-v1.5'
    )