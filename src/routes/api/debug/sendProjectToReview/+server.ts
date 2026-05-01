import { sendProjectToReview } from "$lib/db/airtableClient";

export async function GET() {
    await sendProjectToReview(
        "U091DE0M4NB", // slackId
        1, // journeyNumber
        "hackatime project", // HackatimeProjectName
        "https://cdn.hackclub.com/019d8810-944d-7e3e-9650-9650b638ab40/61RahTQtAqL._AC_UF894,1000_QL80_.jpg", // screenshotUrl
        "a description", // description
        "pkd2210", // githubUsername
        "https://github.com", // codeUrl
        "https://google.com" // playableUrl
    );

    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            "content-type": "application/json",
        },
    });
}
