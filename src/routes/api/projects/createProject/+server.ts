import { createProject, getSlackId, getProjects } from "$lib/db/airtableClient";

const isApproved = (project: any) => String(project?.status || '').trim().toUpperCase() === 'APPROVED';

const isCreateable = (journeyNum: number, projectsByJourney: Record<number, any[]>): boolean => {
    if (projectsByJourney[journeyNum]?.length) return false;

    if (journeyNum === 1) return true;

    const prevJourneySubmitted = projectsByJourney[journeyNum - 1]?.length > 0;
    if (!prevJourneySubmitted) return false;

    if (journeyNum > 2) {
        const twoBackApproved = projectsByJourney[journeyNum - 2]?.some((project: any) => isApproved(project));
        if (!twoBackApproved) return false;
    }

    return true;
};

export async function POST({ request }) {
    try {
        const { projectName, description, journeyNumber, codeUrl, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject } = await request.json();
        const slackId = await getSlackId(request);

        // Get user's projects and check eligibility
        const userProjects = await getProjects(request);
        // Convert object to array if needed
        let projectsArray = Array.isArray(userProjects) ? userProjects : Object.values(userProjects).flat();
        // Filter to only actual projects (not eligibility records)
        const actualProjects = projectsArray.filter((p: any) => p.projectName);
        const projectsByJourney: Record<number, any[]> = {};
        actualProjects.forEach((p: any) => {
            if (!projectsByJourney[p.journeyNumber]) {
                projectsByJourney[p.journeyNumber] = [];
            }
            projectsByJourney[p.journeyNumber].push(p);
        });

        if (!isCreateable(journeyNumber, projectsByJourney)) {
            return new Response(JSON.stringify({ error: "Cannot create project for this journey" }), { status: 403 });
        }

        const newProject = { projectName, description, journeyNumber, codeUrl, readmeUrl, demoUrl, screenshot, aiUsage, hackatimeProject };
        const projectId = await createProject(slackId, newProject as any);
        return new Response(JSON.stringify(newProject), { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
    }
}