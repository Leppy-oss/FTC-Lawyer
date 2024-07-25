import os
from pymongo import MongoClient
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch

def init_mongo():
    print('Connecting to MongoDB Atlas')
    return MongoClient(os.environ['MONGO_KEY'])

def init_collection(db_name, collection_name, mongo_client=None):
    if mongo_client is None:
        mongo_client = init_mongo()
    return mongo_client[db_name][collection_name]

def init_retriever(mongo_client, db_name, collection_name, index_name, embeddings):
    collection = init_collection(db_name, collection_name, mongo_client)
    return MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=embeddings,
        index_name=index_name
    ).as_retriever(
        search_type='similarity',
        search_kwargs={'k': 25}
    )