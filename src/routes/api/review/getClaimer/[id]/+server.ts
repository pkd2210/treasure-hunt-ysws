import { getClaimedSubmission, getSlackId } from "$lib/db/airtableClient";

export async function GET({ params, request }: { params: { id: string }, request: Request }) {
    const slackId = await getSlackId(request);
    if (!slackId) {
        return new Response('Not logged in', { status: 401 });
    }

    try {
        const claimedSubmission = await getClaimedSubmission(params.id);
        if (!claimedSubmission) {
            return new Response(JSON.stringify({ error: "Submission not found or not claimed" }), {
                status: 404,
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        }
        if (claimedSubmission.claimedBy !== slackId) {
            return new Response(JSON.stringify({ error: "You do not have permission to view this submission" }), {
                status: 403,
                headers: { "Content-Type": "application/json; charset=utf-8" }
            });
        }
        return new Response(JSON.stringify(claimedSubmission.claimedBy), {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    } catch (error) {
        console.error("Error fetching claimed submission:", error);
        const message = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Error fetching claimed submission", message }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    }
}