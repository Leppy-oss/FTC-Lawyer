import os

from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from retrieve_rss import retrieve_rss
from langchain.docstore.document import Document
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from init_mongo import init_collection

load_dotenv()

def vectorize_rss(season, rss=None, collection=None):
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
    )
    
    if collection is None:
        collection = init_collection(os.environ['RSS_DB'], str(season))
    
    if rss is None:
        print('No RSS dicts passed, defaulting to retrieved RSS')
        rss = retrieve_rss()
        
    docs = [Document(page_content=f'QUESTION: {r['question']}\n ANSWER: {r['answer']}', metadata={'date': r['date']}) for r in rss]

    print('Vectorizing RSS feed')
    MongoDBAtlasVectorSearch.from_documents(
        documents=docs,
        collection=collection,
        embedding=embeddings,
        index_name=os.environ['RSS_INDEX_BASE'] + str(season),
        relevance_score_fn='cosine'
    )
    print('Successfully stored RSS feed in vector index')
    
if __name__ == '__main__':
    vectorize_rss(2023)