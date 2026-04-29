import { getItems } from '$lib/db/airtableClient';
import type { Item } from '$lib/db/models';
let items: Item[] = []

items = await getItems();

export function GET() {
    return new Response(JSON.stringify(items), {
        headers: { 'Content-Type': 'application/json' },
    });
}