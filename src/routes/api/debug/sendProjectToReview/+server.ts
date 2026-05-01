import { sendProjectToReview } from "$lib/db/airtableClient";

export async function GET() {
    await sendProjectToReview(
        "U091DE0M4NB",
        1,
        "hackatime project",
        "https://cdn.hackclub.com/019d8810-944d-7e3e-9650-9650b638ab40/61RahTQtAqL._AC_UF894,1000_QL80_.jpg",
        "a description",
        "pkd2210",
        "https://github.com",
        "https://google.com"
    );

    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            "content-type": "application/json",
        },
    });
}
