import os
from dotenv import load_dotenv
from retrieve_rss import retrieve_rss
from retrieve_all_vectors import retrieve_pinecone_rss
from pinecone import Pinecone
from vectorize_rss import vectorize_rss
from datetime import datetime

from pymongo import DESCENDING
from init_mongo import init_collection

load_dotenv()
strptime_string = '%Y-%m-%d %H:%M:%S'

def update_rss_vectors(season):
    rss = []
    rss_stored = init_collection(os.environ['RSS_DB'], str(season))
    most_recent_rss_date = datetime.strptime(rss_stored.find().sort('date', DESCENDING)[0]['date'], strptime_string)
    print(f'Most recent RSS date in MongoDB Atlas: {most_recent_rss_date}')

    rss_remote = retrieve_rss()
    
    for entry in rss_remote:
        date = datetime.strptime(entry['date'], strptime_string)
        if date > most_recent_rss_date:
            print(f'Found more recent RSS date in remote: {date}')
            rss.append(entry)
        else:
            print(f'Completed remote RSS retrieval')
            break
        
    vectorize_rss(season, rss, rss_stored)

if __name__ == '__main__':
    update_rss_vectors(2023)