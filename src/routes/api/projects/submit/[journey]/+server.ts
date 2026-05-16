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
        const message =
            (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string")
                ? (error as any).message
                : (error instanceof Error ? error.message : "Failed to submit project");
        const isUserInputError =
            message.includes("not found") ||
            message.includes("not eligible") ||
            message.includes("already been submitted") ||
            message.includes("missing a code URL") ||
            message.includes("must be a GitHub repository URL") ||
            message.includes("Invalid attachment object") ||
            message.includes("missing a screenshot URL");

        return new Response(JSON.stringify({ error: message }), { status: isUserInputError ? 400 : 500 });
    }
}