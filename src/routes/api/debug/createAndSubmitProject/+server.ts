import { createProject, submitProjectForReview } from "$lib/db/airtableClient";

export async function GET() {
    const slackId = "U091DE0M4NB"; // change to a valid test user in your base
    const project = {
        projectName: `Debug Project ${Date.now()}`,
        description: "Automated debug project",
        codeUrl: "https://github.com/hackclub/example",
        readmeUrl: "https://example.com/readme",
        demoUrl: "https://example.com",
        screenshot: "https://cdn.hackclub.com/placeholder.png",
        aiUsage: "none",
        hackatimeProject: "a hackatime project",
        journeyNumber: 1,
    };

    try {
        const projectId = await createProject(slackId, project as any);
        try {
            await submitProjectForReview(slackId, projectId);
        } catch (submitErr) {
            return new Response(JSON.stringify({ ok: false, error: String(submitErr), projectId }), { headers: { "content-type": "application/json" }, status: 400 });
        }
        return new Response(JSON.stringify({ ok: true, projectId }), { headers: { "content-type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: String(error) }), { headers: { "content-type": "application/json" }, status: 500 });
    }
}
