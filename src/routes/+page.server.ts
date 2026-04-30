import { getSlackId, isUser } from "$lib/db/airtableClient";

export async function load({ request }: { request: Request }) {
    const slackId = await getSlackId(request);
    return { slackId };
}