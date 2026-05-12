import { getProjects } from "$lib/db/airtableClient";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const projects = await getProjects();
    const projectsByJourney: Record<string, typeof projects> = {};
    projects.forEach((project) => {
      const journey = project.journeyNumber || "Unknown Journey";
      if (!projectsByJourney[journey]) {
        projectsByJourney[journey] = [];
      }
      projectsByJourney[journey].push(project);
    });
    return new Response(JSON.stringify(projectsByJourney, null, 2), { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response("Failed to fetch projects", { status: 500 });
  }
}; 