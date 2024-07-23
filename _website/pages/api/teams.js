import { getTeams } from './storage';

export default async function handler(req, res) {
    if (req.method == 'GET') {
        const { season, eventCode } = req.query;
        if (!(season && eventCode)) res.status(400).end({ error: 'Invalid input format' });
        try {
            const response = await getTeams(season, eventCode);
            res.send({ response });
        } catch (e) { res.status(500).send({ error: `Error fetching teams: ${e}` }) }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}