import os
import numpy as np

from retrieve_all_vectors import retrieve_all_vectors

from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
import pinecone

def delete_gm2(season):
    print('Initializing index')
    index = pinecone.Pinecone().Index(os.environ['GM2_INDEX_BASE'] + str(season))
    vectors = retrieve_all_vectors(index)
    ids = []
    for vec_1 in vectors:
        if type(vec_1) is dict:
            for vec_2 in vec_1.values():
                if type(vec_2) is dict:
                    if 'gm2' in vec_2['metadata']['file_path']:
                        vector_id = vec_2['id']
                        print(f'Deleting vector {vector_id}')
                        ids.append(vector_id)
                        
    index.delete(ids)

if __name__ == '__main__':
    delete_gm2(2023)