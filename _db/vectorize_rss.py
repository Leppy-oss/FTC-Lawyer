import os

from dotenv import load_dotenv
from retrieve_rss import retrieve_rss
from langchain.docstore.document import Document
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from init_mongo import init_collection, init_embeddings

load_dotenv()

def vectorize_rss(rss=None, collection=None, embeddings=None):
    if embeddings is None:
        embeddings = init_embeddings()
    
    if collection is None:
        collection = init_collection(os.environ['RSS_COL'])
    
    if rss is None:
        print('No RSS dicts passed, defaulting to retrieved RSS')
        rss = retrieve_rss()
        
    docs = [Document(page_content=f'QUESTION: {r['question']}\n ANSWER: {r['answer']}', metadata={'date': r['date'], 'source-type': 'rss'}) for r in rss]

    print('Vectorizing RSS feed')
    MongoDBAtlasVectorSearch.from_documents(
        documents=docs,
        collection=collection,
        embedding=embeddings,
        index_name=os.environ['RSS_COL'] + os.environ['ISCPT'],
        relevance_score_fn='cosine'
    )
    print('Successfully stored RSS feed in vector index')
    
if __name__ == '__main__':
    vectorize_rss()