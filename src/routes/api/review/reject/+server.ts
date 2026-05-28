import type { RequestHandler } from "@sveltejs/kit";
import { updateProjectReviewOutcome } from "$lib/db/airtableClient";
import { clearCache } from "$lib/server/projectsCache";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const projectId = String(body?.projectId || "").trim();
    const reason = String(body?.reason || "").trim();

    if (!projectId) {
      return new Response(JSON.stringify({ error: "projectId is required" }), { status: 400 });
    }

    if (!reason) {
      return new Response(JSON.stringify({ error: "reason is required" }), { status: 400 });
    }

    await updateProjectReviewOutcome(projectId, "rejected", reason);

    clearCache();

    return new Response(JSON.stringify({ status: "success", message: "Project rejected." }), { status: 200 });
  } catch (error) {
    console.error("Error rejecting project:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};