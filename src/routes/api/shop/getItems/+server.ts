import { getItems } from '$lib/db/airtableClient';
import type { Item } from '$lib/db/models';

export async function GET() {
    const items: Item[] = await getItems();
    const filteredItems = items.filter((item) => item.reward !== true);

    return new Response(JSON.stringify(filteredItems), {
        headers: { 'Content-Type': 'application/json' },
    });
}