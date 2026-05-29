import { getOrders } from '$lib/db/airtableClient';

export async function GET({ request }: { request: Request }) {
    try {
        const orders = await getOrders(request);
        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response("Error fetching orders", { status: 500 });
    }
}