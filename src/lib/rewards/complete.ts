import { Journey } from "$lib/db/models";
import { journeyIdToRecordId, getJourneyById, userSlackIdToUserRecord } from "$lib/db/airtableClient";

export async function completeJourney(slackId: string, journeyNumber: number) {
    const journeyRecordId = journeyIdToRecordId(journeyNumber);

    const journey = await getJourneyById(journeyNumber);

    if (!journey) {
        throw new Error(`Journey with number ${journeyNumber} not found`);
    }

    // we need to do a few things:
    // 1. check if user has more then 1 project in review / a project rejected | Don't allow them to complete the journey if they do
    // 2. send project into review
    // 3. add them to the completers list of the journey
    // 3.5. Bump journeyNumber in the users table by 1
    // 4. once project approved add them the goldbars and send them the order
    // 5. dm them about there project wen't into review
    // 6. dm them when project was approved or rejected
}