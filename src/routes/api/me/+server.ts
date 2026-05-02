import { getFirstName, getLastName, getSlackId, getGoldBars, isAdmin, isReviewer, getAddress as getHomeAddress, getEmailAddress, getCountry, getPhoneNumber } from "$lib/db/airtableClient";

export async function GET({ request }: { request: Request }) {
    // make a request to https://cachet.dunkirk.sh/users/{slackId} to get the user's info
    const apiUrl = 'https://cachet.dunkirk.sh/users/' + await getSlackId(request);
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch user info' }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const responseData = await response.json();

    const displayName = responseData.displayName || '';
    const avatarUrl = responseData.imageUrl || '';
    const pronouns = responseData.pronouns || '';
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

    return new Response(JSON.stringify({ displayName, avatarUrl, pronouns, slackId, firstName, lastName, goldBars, isAdmin: isAAdmin, isReviewer: isAReviewer, homeAddress, emailAddress, country, phoneNumber }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
