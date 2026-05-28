import { getPendingSubmissions } from "$lib/db/airtableClient";

export async function GET() {
    try {
        const pendingSubmissions = await getPendingSubmissions();

        const projects = pendingSubmissions.map((s: any) => {
            const hackatimeProject = s["hackatime project"] || s["Hackatime Project name"] || "";

            return {
                id: String(s.recordId),
                projectName: hackatimeProject,
                description: s["Description"] || "",
                codeUrl: s["Code URL"] || "",
                readmeUrl: s["Readme URL"] || "",
                demoUrl: s["Playable URL"] || "",
                screenshot: s["Screenshot"],
                aiUsage: s.aiUsage || "",
                hackatimeProject,
                user: s["User"] || "",
                journeyNumber: s.journeyNumber,
                type: s.projectType || s["projectType"] || `Journey ${s.journeyNumber}`,
                status: "pending",
                overrideHoursSpent: s["Optional - Override Hours Spent"],
                overrideHoursSpentJustification: s["Optional - Override Hours Spent Justification"],
                githubUsername: s["GitHub Username"],
                playableUrl: s["Playable URL"],
                slackId: s["Slack ID"] || s["SlackID"] || s["Slack Id"] || "",
            };
        });

        return new Response(JSON.stringify({ projects }, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    } catch (error) {
        console.error("Error fetching pending submissions:", error);
        const message = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Error fetching pending submissions", message }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8" }
        });
    }
}