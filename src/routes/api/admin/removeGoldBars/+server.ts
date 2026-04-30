import { updateGoldBars, getGoldBars } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const slackId = url.searchParams.get("slackId");
    const amountStr = url.searchParams.get("amount");

    if (!slackId || !amountStr) {
        return new Response("Missing slackId or amount", { status: 400 });
    }

    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
        return new Response("Invalid amount", { status: 400 });
    }

    const currentGoldBars = await getGoldBars(request, slackId);
    if (currentGoldBars === null) {
        return new Response("User not found", { status: 404 });
    }

    const newGoldBars = currentGoldBars - amount;
    if (newGoldBars < 0) {
        return new Response("User does not have enough gold bars", { status: 400 });
    }
    await updateGoldBars(slackId, newGoldBars);

    return new Response(`Removed ${amount} gold bars from user ${slackId}. New total: ${newGoldBars}`, { status: 200 });
}