import os
from init_mongo import init_collection

def delete_embeddings(source_type, collection=None):
    if collection is None:
        collection = init_collection(source_type)
        
    print(f'Deleting {source_type} index')
    collection.delete_many({ 'source-type': source_type })
    
def delete_all(collections=None):
    delete_embeddings(os.environ['GM1_COL'], collections[0])
    delete_embeddings(os.environ['GM2_COL'], collections[1])
    delete_embeddings(os.environ['RSS_COL'], collections[2])