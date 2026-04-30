import { getFirstName, getSlackId, getGoldBars, isAdmin, isReviewer, getHomeAddress, getEmailAddress, getCountry, getPhoneNumber } from "$lib/db/airtableClient";

export async function load({ request }: { request: Request }) {
    const slackId = await getSlackId(request);
    const firstName = await getFirstName(request);
    const goldBars = await getGoldBars(request);
    const homeAddress = await getHomeAddress(request);
    const isAAdmin = await isAdmin(slackId);
    const isAReviewer = await isReviewer(slackId);
    const emailAddress = await getEmailAddress(request);
    const country = await getCountry(request);
    const phoneNumber = await getPhoneNumber(request);
    return { slackId, firstName, goldBars, isAdmin: isAAdmin, isReviewer: isAReviewer, homeAddress, emailAddress, country, phoneNumber };
}