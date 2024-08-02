import { getRetriever } from '../conn';
import { formatDocumentsAsString } from 'langchain/util/document';

export async function GET(req) {
    if (req.method == 'GET') {
        try {
            const invocation = formatDocumentsAsString(await getRetriever().invoke('THIS IS AN EMPTY STRING.'));

            return new Response(JSON.stringify({ response: `Successful Server Refresh: ${invocation}` }), {
                headers: {
                    Connection: 'keep-alive',
                    'Content-Encoding': 'none',
                    'Cache-Control': 'no-cache, no-transform',
                    'Content-Type': 'text/event-stream; charset=utf-8',
                },
            });
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
            'Allow': ['GET'],
        }
    });
}

export const runtime = 'nodejs';