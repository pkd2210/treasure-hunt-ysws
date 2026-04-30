import { getOrders } from "$lib/db/airtableClient";
import type { Order } from "$lib/db/models";


export async function GET({ request }: { request: Request }) {
    const orders = await getOrders(request);
    return new Response(JSON.stringify(orders), {
        headers: { 'Content-Type': 'application/json' },
    });
}