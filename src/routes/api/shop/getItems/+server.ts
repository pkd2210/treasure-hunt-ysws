import { getItems } from '$lib/db/airtableClient';
import type { Item } from '$lib/db/models';

export async function GET() {
    const items: Item[] = await getItems();
    const filteredItems = items.filter((item) => item.reward !== true);

    return new Response(JSON.stringify(filteredItems, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=300' },
    });
}