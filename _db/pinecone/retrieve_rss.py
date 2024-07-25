import os
from dotenv import load_dotenv
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime

load_dotenv()

def format_rss(entry):
    p_html = BeautifulSoup(entry.summary, features='lxml').body
    return {
        'date': str(datetime.strptime(entry.published.split(', ')[1].split(' +')[0], '%d %b %Y %H:%M:%S')),
        'question': p_html.find('span', attrs={'name': 'question'}).text,
        'answer': p_html.find('span', attrs={'name': 'answer'}).text
    }

def retrieve_rss():
    print('Retrieving RSS from FTC Q&A')
    feed = feedparser.parse(os.environ['RSS_LINK'])
    print('Formatting RSS retrieved from RSS_LINK')
    return [format_rss(entry) for entry in feed.entries]

if __name__ == '__main__':
    print(retrieve_rss())