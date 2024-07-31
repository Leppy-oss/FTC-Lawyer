import { ChatGroq } from '@langchain/groq';
import { MessagesPlaceholder, ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getRetriever } from '../conn';
import { formatDocumentsAsString } from 'langchain/util/document';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

const llm = new ChatGroq({
	apiKey: process.env.GROQ_API_KEY,
	model: 'llama3-8b-8192',
	temperature: 0
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
	if (req.method == 'POST') {
		const { query, temperature, chat_history: raw_chat_history = [] } = await req.json();
		if (!query) return new Response(
			JSON.stringify({ error: 'Invalid input format' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let human = false;
		const chat_history = raw_chat_history.map(msg => {
			human = !human;
			return new (human ? HumanMessage : AIMessage)(msg);
		});

		try {
			llm.temperature = temperature ?? 0;

			const retriever = getRetriever();
			const prompt = ChatPromptTemplate.fromMessages([
				['system', process.env.PROMPT_TEMPLATE_STRING],
				new MessagesPlaceholder('chat_history'),
				['human', '{query}'],
			]);

			const chain = RunnableSequence.from([{
				context: async input => 'chat_history' in input? RunnableSequence.from([
                    input => input.query,
                    retriever.pipe(formatDocumentsAsString),
                    ret => { console.log('Retrieved docs'); return ret; }
                ]) : '',
				query: input => input.query,
				chat_history: input => [] //input.chat_history
			}, prompt, llm, new StringOutputParser()]);

			const responseStream = new TransformStream();
			const streamWriter = responseStream.writable.getWriter();
			const encoder = new TextEncoder();
			const stream = await chain.stream({ query, chat_history });
            console.log('Response arriving');
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

export const runtime = 'nodejs';