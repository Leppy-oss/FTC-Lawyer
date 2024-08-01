import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import client from '../../../lib/mongodb';
import { EnsembleRetriever } from 'langchain/retrievers/ensemble';

let retriever: EnsembleRetriever;

export const getRetriever = () => {
	if (!retriever) {
		const embeddings = new HuggingFaceInferenceEmbeddings(
			{
				apiKey: process.env.HF_API_KEY,
				model: 'BAAI/bge-base-en-v1.5'
			}
		);
		retriever = new EnsembleRetriever({
			retrievers: ['GM1', 'GM2', 'RSS'].map(col => new MongoDBAtlasVectorSearch(
				embeddings, {
				collection: client.db(process.env.DB_NAME).collection(process.env[`${col}_COL`]!),
				indexName: process.env[`${col}_COL`]! + process.env.ISCPT!,
			}).asRetriever({ k: 4 })),
			weights: [0.4, 0.4, 0.2],
		});
	}
	return retriever;
}