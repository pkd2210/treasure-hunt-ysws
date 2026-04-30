import { deleteItem } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    
    if (!name) {
        return new Response("Missing name", { status: 400 });
    }

    await deleteItem(name);

    return new Response(`Item "${name}" deleted successfully`, { status: 200 });
}