import os
from dotenv import load_dotenv
from retrieve_rss import retrieve_rss
from retrieve_all_vectors import retrieve_pinecone_rss
from pinecone import Pinecone
from vectorize_rss import vectorize_rss
from datetime import datetime

load_dotenv()
strptime_string = '%Y-%m-%d %H:%M:%S'

def update_rss_vectors(season):
    rss = []
    print('Initializing Pinecone index')
    index = Pinecone().Index(os.environ['RSS_INDEX_BASE'] + str(season))
    rss_remote = retrieve_rss()
    rss_stored = retrieve_pinecone_rss(index)
    most_recent_rss_date = datetime.strptime((max(rss_stored, key= lambda x:x['date']))['date'], strptime_string)
    sorted_rss_dates = [i['date'] for i in sorted(rss_stored, key= lambda x:x['date'])]
    
    print(f'Most recent RSS date in Pinecone: {most_recent_rss_date}')
    for entry in rss_remote:
        date = datetime.strptime(entry['date'], strptime_string)
        if date > most_recent_rss_date:
            print(f'Found more recent RSS date in remote: {date}')
            rss.append(entry)
        else:
            print(f'Completed remote RSS retrieval')
            break

    print(len(sorted_rss_dates))

if __name__ == '__main__':
    update_rss_vectors(2023)