import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import client from '../../../lib/mongodb';

let vectorStore: MongoDBAtlasVectorSearch;

export const getVectorStore = () => {
	if (!vectorStore) {
		vectorStore = new MongoDBAtlasVectorSearch(
			new HuggingFaceInferenceEmbeddings(
				{
					apiKey: process.env.HF_API_KEY,
					model: 'BAAI/bge-small-en-v1.5'
				}
			), {
				collection: client.db(process.env.DB_NAME).collection(process.env.COL_NAME),
				indexName: process.env.INDEX_NAME,
			}
		)
	}
	return vectorStore;
}