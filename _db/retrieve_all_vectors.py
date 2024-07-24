import os
import numpy as np

from dotenv import load_dotenv
import pinecone

load_dotenv()

def retrieve_all_vectors(index):
    print('Searching vectors in index')
    ids = index.list()
    return index.fetch(list(ids)[0]).to_dict().values()