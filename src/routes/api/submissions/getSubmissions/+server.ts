import { getSubmissionBySlackId, getSlackId } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const slackId = url.searchParams.get("slackId") || await getSlackId(request);
    
    if (!slackId) {
        return new Response("Missing slackId", { status: 400 });
    }

    const submission = await getSubmissionBySlackId(slackId);

    if (!submission) {
        return new Response("Submission not found", { status: 404 });
    }
    const filteredSubmission = {
        id: submission.id,
        journeyNumber: submission.journeyNumber,
        "Hackatime Project name": submission["Hackatime Project name"],
        status: submission.status,
        "Optional - Override Hours Spent": submission["Optional - Override Hours Spent"],
        "Optional - Override Hours Spent Justification": submission["Optional - Override Hours Spent Justification"],
        "Screenshot": submission["Screenshot"],
        "Description": submission["Description"],
        "GitHub Username": submission["GitHub Username"],
        "Code URL": submission["Code URL"],
        "Playable URL": submission["Playable URL"],
    };
    return new Response(JSON.stringify(filteredSubmission), {
        headers: { 'Content-Type': 'application/json' },
    });
}