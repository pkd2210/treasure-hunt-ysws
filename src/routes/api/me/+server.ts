import { getFirstName, getLastName, getSlackId, getGoldBars, isAdmin, isReviewer, getHomeAddress, getEmailAddress, getCountry, getPhoneNumber } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    const slackId = await getSlackId(request);
    const firstName = await getFirstName(request);
    const lastName = await getLastName(request);
    const goldBars = await getGoldBars(request);
    const homeAddress = await getHomeAddress(request);
    const isAAdmin = await isAdmin(slackId);
    const isAReviewer = await isReviewer(slackId);
    const emailAddress = await getEmailAddress(request);
    const country = await getCountry(request);
    const phoneNumber = await getPhoneNumber(request);

    return new Response(JSON.stringify({ slackId, firstName, lastName, goldBars, isAdmin: isAAdmin, isReviewer: isAReviewer, homeAddress, emailAddress, country, phoneNumber }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
