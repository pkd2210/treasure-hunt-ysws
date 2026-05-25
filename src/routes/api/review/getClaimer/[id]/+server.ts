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
        const claimedAtMs = Date.parse(claimedSubmission.claimedAt || "");
        const expiresAtMs = Number.isFinite(claimedAtMs) ? claimedAtMs + 30 * 60 * 1000 : 0;
        return new Response(JSON.stringify({
            claimedBy: claimedSubmission.claimedBy || "",
            claimedAt: claimedSubmission.claimedAt || "",
            remainingMs: Math.max(0, expiresAtMs - Date.now()),
            slackId,
            isMine: claimedSubmission.claimedBy === slackId,
            expiresAt: expiresAtMs ? new Date(expiresAtMs).toISOString() : ""
        }), {
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