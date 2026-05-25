import { claimSubmission, getSlackId } from "$lib/db/airtableClient";

export async function GET({ params, request }: { params: { id: string }, request: Request }) {
    const slackId = await getSlackId(request);
    if (!slackId) {
        return new Response('Not logged in', { status: 401 });
    }

    try {
        await claimSubmission(params.id, slackId);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    } catch (error) {
        console.error("Error claiming submission:", error);
        const message = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Error claiming submission", message }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    }
}