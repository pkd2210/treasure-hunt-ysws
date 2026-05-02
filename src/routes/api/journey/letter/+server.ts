import { getJourneyLetter } from "$lib/db/airtableClient";

export async function GET({ url }: { url: URL }) {
    const rawJourney = url.searchParams.get('journey');
    const journey = rawJourney ? Number(rawJourney) : NaN;

    if (!Number.isFinite(journey)) {
        return new Response(JSON.stringify({ error: 'Invalid or missing journey query parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    try {
        const letterData = await getJourneyLetter(journey);

        if (!letterData) {
            return new Response(JSON.stringify({ error: 'Letter not found for this journey' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(letterData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching letter data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch letter data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}