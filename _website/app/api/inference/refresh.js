import { getRetriever } from './conn';

export async function GET(req) {
    if (req.method == 'GET') {
        try {
            getRetriever();

            return new Response('Successful Server Refresh', {
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