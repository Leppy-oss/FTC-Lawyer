import { ChatGroq } from '@langchain/groq';
import { pull } from 'langchain/hub';
import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Document } from '@langchain/core/documents';
import { getTeamData } from './storage';
import { DocumentRetriever } from './DocumentRetriever';

const llm = new ChatGroq({
	apiKey: process.env.GROQ_API_KEY,
	model: 'llama3-70b-8192',
	temperature: 0
});

const formatDocumentsAsString = docs => docs.map((doc) => doc.pageContent).join("\n\n");

export default async function longRunningResponse(req) {
	if (req.method == 'POST') {
		const { query, teams, season, eventCode } = await req.json();
		if (!(query && teams && season && eventCode)) return new Response(
			JSON.stringify({ error: 'Invalid input format' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});

		try {
			const data = await getTeamData(season, eventCode);
			const docs = teams.map(team => new Document({ pageContent: JSON.stringify(data[team]) }));
			try {
				const retriever = new DocumentRetriever(docs);
				const prompt = await pull('rlm/rag-prompt');
				prompt.promptMessages[0].prompt.template = process.env.PROMPT_TEMPLATE_STRING;

				const chain = RunnableSequence.from([{
						context: retriever.pipe(formatDocumentsAsString),
						question: new RunnablePassthrough(),
					},
					prompt,
					llm,
					new StringOutputParser(),
				]);

				const responseStream = new TransformStream();
				const streamWriter = responseStream.writable.getWriter();
				const encoder = new TextEncoder();
				const stream = await chain.stream(query);
				const streamText = async() => {
					try {
						for await (const chunk of stream) {
							streamWriter.write(encoder.encode(chunk));
						}
					} catch (e) { streamWriter.write(encoder.encode(`Error: ${e}`)) }
					streamWriter.close();
				}
				streamText();

				return new Response(responseStream.readable, {
					headers: {
						Connection: "keep-alive",
						"Content-Encoding": "none",
						"Cache-Control": "no-cache, no-transform",
						"Content-Type": "text/event-stream; charset=utf-8",
					},
				})
			} catch (e) {
				return new Response(
					JSON.stringify({ error: `Error processing the query: ${e}` }), {
						status: 500,
						headers: {
							'Content-Type': 'application/json'
						}
					});
			}
		} catch (e) {
			return new Response(
				JSON.stringify({ error: `Error fetching data from FTCScout: ${e}` }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				});
		}
	} else {
		return new Response({
			status: 405,

		})
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

export const config = {
	runtime: 'edge'
};