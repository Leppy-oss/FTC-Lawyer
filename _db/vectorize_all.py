import os

from vectorize_gm1 import vectorize_gm1
from vectorize_gm2 import vectorize_gm2
from vectorize_rss import vectorize_rss

from delete_embeddings import delete_all
from init_mongo import init_collection, init_embeddings

collections=[init_collection(os.environ['GM1_COL']), init_collection(os.environ['GM2_COL']), init_collection(os.environ['RSS_COL'])]
embeddings = init_embeddings()

delete_all(collections)
vectorize_gm1(collections[0], embeddings)
vectorize_gm2(collections[1], embeddings)
vectorize_rss(None, collections[2], embeddings)