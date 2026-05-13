import { updateProject, getSlackId, getProjects } from "$lib/db/airtableClient";

export async function POST({ request }) {
    try {
        const { projectName, description, journeyNumber, codeUrl, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject } = await request.json();
        const slackId = await getSlackId(request);

        if (!slackId) {
            return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
        }

        const updatedProject = { projectName, description, codeUrl, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject };
        await updateProject(slackId, journeyNumber, updatedProject as any);
        return new Response(JSON.stringify(updatedProject), { status: 200 });
    }
    catch (error) {
        console.error("Error updating project:", error);
        return new Response(JSON.stringify({ error: "Failed to update project" }), { status: 500 });
    }
}