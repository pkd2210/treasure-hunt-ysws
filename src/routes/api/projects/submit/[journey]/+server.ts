import { submitProjectForReview, getProjects, getSlackId } from "$lib/db/airtableClient";

export async function GET({ params, request }) {
    try {
        const journeyNumber = Number(params.journey);
        if (!Number.isInteger(journeyNumber) || journeyNumber <= 0) {
            return new Response(JSON.stringify({ error: "Invalid journey" }), { status: 400 });
        }

        const slackId = await getSlackId(request);
        if (!slackId) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
        }

        const projects = await getProjects(request);
        const project = projects.find((p) => Number(p.journeyNumber) === journeyNumber);
        if (!project) {
            const availableJourneys = projects.map((p) => Number(p.journeyNumber)).filter((n) => Number.isFinite(n));
            return new Response(JSON.stringify({ error: "Project not found for this journey", availableJourneys }), { status: 404 });
        }

        await submitProjectForReview(slackId, project.id);
        return new Response(JSON.stringify({ ok: true, journey: journeyNumber, projectId: project.id }), { status: 200 });
    }
    catch (error) {
        console.error("Error submitting project:", error);
        return new Response(JSON.stringify({ error: "Failed to submit project" }), { status: 500 });
    }
}