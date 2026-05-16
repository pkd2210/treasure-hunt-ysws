import { createOrder, updateGoldBars, getGoldBars, getItemById, getSlackId } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const itemId = url.searchParams.get("itemId");
    const amount = url.searchParams.get("amount");

    if (!itemId || !amount) {
        return new Response("Missing itemId or amount", { status: 400 });
    }

    const quantity = parseInt(amount, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return new Response("Invalid amount", { status: 400 });
    }

    // get Item name, price, dexcription, and imageurl from airtable
    const item = await getItemById(itemId);
    if (!item) {
        return new Response("Item not found", { status: 404 });
    }
    if (item.reward === true) {
        return new Response("Cannot purchase reward items", { status: 400 });
    }
    const price = item.price;
    const totalPrice = price * quantity;

    const slackId = await getSlackId(request);
    if (!slackId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const currentGoldBars = await getGoldBars(request, slackId);
    if (currentGoldBars === null) {
        return new Response("User not found", { status: 404 });
    }

    if (currentGoldBars < totalPrice) {
        return new Response("Not enough gold bars", { status: 400 });
    }


    const order = {
        slackId,
        itemId,
        amount: quantity,
        totalPrice,
        status: "pending",
    };

    await createOrder(order);
    await updateGoldBars(slackId, currentGoldBars - totalPrice);

    return new Response(JSON.stringify("Item purchased successfully"), { status: 200, headers: { "content-type": "application/json" } });
}