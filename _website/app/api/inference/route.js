import { ChatGroq } from '@langchain/groq';
import { pull } from 'langchain/hub';
import {
	RunnablePassthrough,
	RunnableSequence,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getVectorStore } from './conn';

const llm = new ChatGroq({
	apiKey: process.env.GROQ_API_KEY,
	model: 'llama3-70b-8192',
	temperature: 0
});

export const dynamic = 'force-dynamic';

const formatDocumentsAsString = docs => docs.map((doc) => doc.pageContent).join('\n\n')

export async function POST(req) {
	if (req.method == 'POST') {
		const { query, temperature } = await req.json();
		if (!query) return new Response(
			JSON.stringify({ error: 'Invalid input format' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		llm.temperature = temperature ?? 0;

		try {
			const retriever = getVectorStore().asRetriever();
			const prompt = await pull('rlm/rag-prompt');
			// prompt.promptMessages[0].prompt.template = process.env.PROMPT_TEMPLATE_STRING;

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
			const streamText = async () => {
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
					Connection: 'keep-alive',
					'Content-Encoding': 'none',
					'Cache-Control': 'no-cache, no-transform',
					'Content-Type': 'text/event-stream; charset=utf-8',
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
	}
	return new Response(`Method ${req.method} Not Allowed`, {
		status: 405,
		headers: {
			'Allow': ['POST'],
		}
	});
}

export const config = {
	runtime: 'nodejs'
};