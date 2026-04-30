import { getOrders } from "$lib/db/airtableClient";
import type { Order } from "$lib/db/models";


export async function GET({ request }: { request: Request }) {
    const orders = await getOrders(request);
    const filteredOrders = Array.isArray(orders)
        ? orders.map(({ address, email, phone, ...rest }) => rest)
        : Object.fromEntries(
            Object.entries(orders).map(([key, order]) => {
                const { address, email, phone, ...rest } = order;
                return [key, rest];
            })
        );
    return new Response(JSON.stringify(filteredOrders), {
        headers: { 'Content-Type': 'application/json' },
    });
}