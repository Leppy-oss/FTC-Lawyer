import os

from dotenv import load_dotenv
from langchain_community.document_loaders import RSSFeedLoader
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_pinecone import PineconeVectorStore
from retrieve_rss import retrieve_rss
from langchain.docstore.document import Document

def vectorize_rss(season):
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
    )
    
    rss = retrieve_rss()
    docs = [Document(page_content=f'QUESTION: {r['question']}\n ANSWER: {r['answer']}', metadata={'date': r['date']}) for r in rss]

    print('Loading RSS feed')

    print('Vectorizing RSS feed')
    PineconeVectorStore.from_documents(documents=docs, index_name=os.environ['RSS_INDEX_BASE'] + str(season), embedding=embeddings)
    print('Successfully stored RSS feed in vector index')
    
if __name__ == '__main__':
    vectorize_rss(2023)