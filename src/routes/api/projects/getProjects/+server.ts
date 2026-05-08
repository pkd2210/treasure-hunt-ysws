import { getProjects } from "$lib/db/airtableClient";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const projects = await getProjects();
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response("Failed to fetch projects", { status: 500 });
  }
}; 