import os

from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_pinecone import PineconeVectorStore

load_dotenv()

def vectorize_gm2(season):
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ['HF_API_KEY'], model_name='BAAI/bge-small-en-v1.5'
    )

    docs = PyMuPDFLoader('../res/gm2.pdf').load_and_split()
    print('Loaded PDFS')

    print('Vectorizing gm2')
    PineconeVectorStore.from_documents(documents=docs, index_name=os.environ['GM2_INDEX_BASE'] + str(season), embedding=embeddings)
    print('Successfully stored gm2 index')
    
if __name__ == '__main__':
    vectorize_gm2(2023)