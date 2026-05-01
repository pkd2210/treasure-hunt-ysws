import { journeyIdToRecordId, getJourneyById, userSlackIdToUserRecord, addToCompleters, updateJourneyNumber } from "$lib/db/airtableClient";

export async function completeJourney(slackId: string, journeyNumber: number) {
    const journeyRecordId = journeyIdToRecordId(journeyNumber);

    const journey = await getJourneyById(journeyNumber);

    if (!journey) {
        throw new Error(`Journey with number ${journeyNumber} not found`);
    }

    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error(`User with slackId ${slackId} not found`);
    }

    // we need to do a few things:
    // check if the journey humber isn't larger then 7
    //if (journeyNumber > 7) {
    //    throw new Error("Congrats on completing the treasure hunt! Stay tuned for future adventures.");
   // }
    // 1. check if user has more then 1 project in review / a project rejected | Don't allow them to complete the journey if they do
    //const submission = await getSubmissionBySlackId(slackId);
    //let inReviewCounter = 0;
    //if (submission) {
    //    if (submission.status === "unreviewed") {
    //        inReviewCounter++;
    //    } else if (inReviewCounter > 2) {
    //        throw new Error("You have too many projects in review. Please wait for them to be reviewed before submitting another project.");
    //    } else if (submission.status === "rejected") {
    //        throw new Error("One of your projects was rejected. Please update your project and resubmit it before submitting another project.");
    //    }
    //}
    // 2. send project into review.
    // 3. add them to the completers list of the journey
    await addToCompleters(journeyNumber, userRecord.id);
    // 3.5. Bump journeyNumber in the users table by 1
    await updateJourneyNumber(slackId, journeyNumber + 1);
    // ~4. once project approved add them the goldbars and send them the order - do in review workflow~
    // 5. dm them about there project wen't into review
    // ~6. dm them when project was approved or rejected- do in review workflow~
    // ~7. if approved dm them about the gold bars they earned and make order~
}