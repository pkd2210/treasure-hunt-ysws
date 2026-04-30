import { createItem } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const description = url.searchParams.get("description");
    const costStr = url.searchParams.get("cost");
    const imageUrl = url.searchParams.get("imageUrl");

    if (!name || !description || !costStr || !imageUrl) {
        return new Response("Missing name, description, cost, or imageUrl", { status: 400 });
    }

    const price = parseInt(costStr, 10);
    if (isNaN(price) || price <= 0) {
        return new Response("Invalid price", { status: 400 });
    }


    await createItem(name, description, price, imageUrl);

    return new Response(`Item "${name}" created successfully`, { status: 200 });
}