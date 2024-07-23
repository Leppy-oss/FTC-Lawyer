import { BaseRetriever } from '@langchain/core/retrievers';

// Very basic retriever that returns all documents available
export class DocumentRetriever extends BaseRetriever {
	lc_namespace = ['langchain', 'retrievers'];

	constructor(docs) { super({}); this.docs = docs; }

	async _getRelevantDocuments(_, __) { return this.docs; }
}