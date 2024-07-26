from dotenv import load_dotenv
from retrieve_rss import retrieve_rss
from vectorize_rss import vectorize_rss
from datetime import datetime

from pymongo import DESCENDING

load_dotenv()
strptime_string = '%Y-%m-%d %H:%M:%S'

def update_rss_vectors(collection=None, embeddings=None):
    rss = []
    most_recent_rss_date = datetime.strptime(collection.find({ 'source-type': 'rss' }).sort('date', DESCENDING)[0]['date'], strptime_string)
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
        
    vectorize_rss(rss, collection, embeddings)

if __name__ == '__main__':
    update_rss_vectors(2023)