import os

from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_mongodb.vectorstores import MongoDBAtlasVectorSearch
from init_mongo import init_collection, init_embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

def vectorize_gm2(collection=None, embeddings=None):
    if embeddings is None:
        embeddings = init_embeddings()

    if collection is None:
        collection = init_collection(os.environ['GM2_COL'])

    docs = PyMuPDFLoader('./res/gm2.pdf').load()
    docs = docs[5:36]
    docs = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20).split_documents(docs)
    for doc in docs:
        doc.metadata['source-type'] = 'gm2'
    print('Loaded PDFS')

    print('Vectorizing gm2')
    
    MongoDBAtlasVectorSearch.from_documents(
        documents=docs,
        collection=collection,
        embedding=embeddings,
        index_name=os.environ['GM2_COL'] + os.environ['ISCPT'],
        relevance_score_fn='cosine'
    )
    print('Successfully stored gm2 index')
    
if __name__ == '__main__':
    vectorize_gm2()