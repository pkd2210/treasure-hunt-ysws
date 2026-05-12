import { createProject, getSlackId } from "$lib/db/airtableClient";

export async function POST({ request }) {
    try {
        const { projectName, description, journeyNumber, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject } = await request.json();
        // create project get export async function createProject(slackId: string, project: Project): Promise<string> {
        const newProject = { projectName, description, journeyNumber, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject };
        // get user's slackId from request
        const slackId = await getSlackId(request);
        const projectId = await createProject(slackId, newProject as any);
        return new Response(JSON.stringify(newProject), { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
    }
}