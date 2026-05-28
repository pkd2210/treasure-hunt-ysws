import { checkFraudStatus, getProjects } from "$lib/db/airtableClient";
import { getOrSetRelay } from "$lib/server/projectsCache";
import { getSlackId } from "$lib/db/airtableClient";
import type { RequestHandler } from "@sveltejs/kit";

async function fetchAndGroupProjects(request: Request) {
  const projects = await getProjects(request);
  await Promise.all(projects.map(async (project) => {
    if (!project.submission) {
      return;
    }

    try {
      const fraudStatus = await checkFraudStatus(project.submission);
      project.status = fraudStatus.status === "approved" || fraudStatus.status === "rejected"
        ? fraudStatus.status as "approved" | "rejected"
        : project.status;
      if (fraudStatus.reason) {
        project.rejectionReason = fraudStatus.reason;
      }
    } catch (error) {
      console.error(`Error syncing fraud status for project ${project.id}:`, error);
    }
  }));
  const projectsByJourney: Record<string, typeof projects> = {};
  projects.forEach((project) => {
    const journey = project.journeyNumber || "Unknown Journey";
    if (!projectsByJourney[journey]) {
      projectsByJourney[journey] = [];
    }
    projectsByJourney[journey].push(project);
  });
  return projectsByJourney;
}

export const GET: RequestHandler = async ({ request }) => {
  try {
    const slackId = await getSlackId(request);
    const cacheKey = slackId ? `projects:${slackId}` : 'projects:anonymous';
    const projectsByJourney = await getOrSetRelay(cacheKey, () => fetchAndGroupProjects(request));
    return new Response(JSON.stringify(projectsByJourney, null, 2), { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response("Failed to fetch projects", { status: 500 });
  }
}; 