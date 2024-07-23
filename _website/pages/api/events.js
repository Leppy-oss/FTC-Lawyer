import { getEvents } from './storage';

export default async function handler(req, res) {
	if (req.method == 'GET') {
		const { season } = req.query;
		if (!season) res.status(400).end({ error: 'Failed to specify a season' });
		try {
			const response = await getEvents(season);
			res.send({ response });
		} catch (e) { res.status(500).send({ error: `Error fetching events for season ${season}: ${e}` }) }
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}