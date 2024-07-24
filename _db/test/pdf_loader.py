from langchain_community.document_loaders import PyMuPDFLoader

gm1 = PyMuPDFLoader('../res/gm1.pdf').load()
gm2 = PyMuPDFLoader('../res/gm2.pdf').load()