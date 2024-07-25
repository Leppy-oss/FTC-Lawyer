import os
import numpy as np

from dotenv import load_dotenv
import pinecone

load_dotenv()

def retrieve_all_vectors(index: pinecone.Index) -> list[dict]:
    print('Searching vectors in index')
    ids = index.list()
    return index.fetch(list(ids)[0]).to_dict().values()

def retrieve_pinecone_rss(index: pinecone.Index) -> list[dict]:
    vectors = retrieve_all_vectors(index)
    rss = []
    for vec_1 in vectors:
        if type(vec_1) is dict:
            for vec_2 in vec_1.values():
                if type(vec_2) is dict:
                    rss.append({
                        'id': vec_2['id'],
                        'date': vec_2['metadata']['date']
                    })
                    
    return rss