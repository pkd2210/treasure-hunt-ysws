import { json } from '@sveltejs/kit';
import { getAllApprovedProjects, userRecordIdToSlackId } from "$lib/db/airtableClient";

export async function GET() {
    try {
        const projects = await getAllApprovedProjects();
        
        // Enrich projects with user Slack IDs
        const enrichedProjects = await Promise.all(
            projects.map(async (project) => {
                try {
                    const slackId = await userRecordIdToSlackId(project.user);
                    return {
                        name: project.projectName,
                        slackId: slackId || 'unknown',
                        description: project.description,
                        screenshot: project.screenshot,
                        demoUrl: project.demoUrl || '#',
                        repoUrl: project.codeUrl || '#',
                    };
                } catch (err) {
                    console.error(`Failed to enrich project:`, err);
                    return null;
                }
            })
        );
        
        const validProjects = enrichedProjects.filter(p => p !== null);
        return json(validProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}