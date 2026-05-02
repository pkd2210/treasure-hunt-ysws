import AirtablePkg from "airtable";
import type { AirtableFieldSet, AirtableRecord } from './airtable-types';
const Airtable = AirtablePkg;
import type { Item, Journey, Order, Reward, User, Submission, Project } from "./models";
import { AIRTABLE_KEY, AIRTABLE_BASE_ID } from '$env/static/private';
import type Airtable from "airtable";
import { sendUpdateDM } from "$lib/server/slack/slackClient";
import { completeJourney } from "$lib/rewards/complete";
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE_ID);

export function getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
        const results: Item[] = [];
        base("Items").select().eachPage(
            function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
                for (const record of records) {
                    results.push({
                        id: record.id,
                        name: record.get("name") as string,
                        description: record.get("description") as string,
                        price: record.get("price") as number,
                        imageUrl: record.get("imageUrl") as string,
                        reward: record.get("reward") as boolean,
                    });
                }
                fetchNextPage();
            },
            function done(error: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

//export function getRewards(): Promise<Reward[]> {
//    return new Promise((resolve, reject) => {
//        const results: Reward[] = [];
//        base("Rewards").select().eachPage(
//            function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
//                for (const record of records) {
//                    results.push({
//                        day: record.get("day") as string,
//                        prizeName: record.get("prizeName") as string,
//                        prizeDescription: record.get("prizeDescription") as string,
//                        prizeImageUrl: record.get("prizeImageUrl") as string,
//                    })
//                }
//                fetchNextPage();    
//            },
//            function done(error: any) {
//                if (error) {
//                    reject(error);
//                } else {
//                    results.sort((a, b) => {
//                        const getStartDay = (dayStr: string) => parseInt(dayStr.split(' - ')[0], 10);
//                        return getStartDay(a.day) - getStartDay(b.day);
//                    });
//                    resolve(results);
//                }
//            }
//        );
//    });
//}

export function isUser(slackId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${slackId}'` })
            .firstPage((error: any, records: ReadonlyArray<AirtableRecord<AirtableFieldSet>> = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(records && records.length > 0);
            });
    });
}

export function isAdmin(slackId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${slackId}'` })
            .firstPage((error: any, records: ReadonlyArray<AirtableRecord<AirtableFieldSet>> = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(false);
                    return;
                }
                const admin = records[0].get("admin");
                resolve(Boolean(admin));
            });
    });
}

export function isReviewer(slackId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${slackId}'` })
            .firstPage((error: any, records: ReadonlyArray<AirtableRecord<AirtableFieldSet>> = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0 ) {
                    resolve(false);
                    return;
                }
                const reviewer = records[0].get("reviewer");
                resolve(Boolean(reviewer));
            });
    });
}

export function addUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
        base("Users").create(
            [
                {
                    fields: {
                        slackId: user.slackId,
                        goldBars: 0,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        address1: user.address1 || "",
                        address2: user.address2 || "",
                        city: user.city || "",
                        state: user.state || "",
                        zip: user.zip || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        country: user.country || "",
                        admin: false,
                        reviewer: false,
                        birthday: user.birthday || "",
                        journeyNumber: 1,
                    },
                },
            ],
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
        sendUpdateDM(user.slackId, "Welcome to the Treasure Hunt!", `👋 | Hi ${user.firstName}! Welcome to the Treasure Hunt!\n You should complete 7 Journeys in 4 weeks!\n Each journey Will earn you a reward after 4 hours\nComplete more then 4 hours per journey? You can earn Goldbars to use in the shop!\n(8 Goldbars per hour after the 4 hours, and 10 per hours if you complete the journey within the theme).\n\nGood luck!`).catch(error => {
            console.error("Error sending welcome DM:", error);
        });
    });
}

export async function getSlackId(request?: Request): Promise<string | null> {
    if (!request) return null;
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
        return null;
    }
    const cookies = cookieHeader.split(";").map(cookie => cookie.trim());
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith("access_token="));
    if (!accessTokenCookie) {
        return null;
    }
    const accessToken = accessTokenCookie.split("=")[1];

    try {
        const response = await fetch("https://auth.hackclub.com/api/v1/me", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            return null;
        }
        const userData = await response.json();
        const slackId = userData.slack_id || (userData.identity && userData.identity.slack_id) || null;
        return slackId;
    } catch (_err) {
        return null;
    }
}

export async function getFirstName(request?: Request, slackId?: string): Promise<string | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error: any, records: ReadonlyArray<AirtableRecord<AirtableFieldSet>> = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const firstName = records[0].get("firstName") as string;
                resolve(firstName);
            });
    });
}

export async function getLastName(request?: Request, slackId?: string): Promise<string | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error: any, records: ReadonlyArray<AirtableRecord<AirtableFieldSet>> = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const lastName = records[0].get("lastName") as string;
                resolve(lastName);
            });
    });
}

export async function getGoldBars(request?: Request, slackId?: string): Promise<number | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const goldBars = records[0].get("goldBars") as number;
                resolve(goldBars);
            });
    });
}

export async function getAddress(request?: Request, slackId?: string): Promise<{ address1: string; address2: string; city: string; state: string; zip: string } | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const address1 = records[0].get("address1") as string;
                const address2 = records[0].get("address2") as string;
                const city = records[0].get("city") as string;
                const state = records[0].get("state") as string;
                const zip = records[0].get("zip") as string;
                resolve({ address1, address2, city, state, zip });
            });
    });
}

export async function getEmailAddress(request?: Request, slackId?: string): Promise<string | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<AirtableFieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const emailAddress = records[0].get("email") as string;
                resolve(emailAddress);
            });
    });
}

export async function getCountry(request?: Request, slackId?: string): Promise<string | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const country = records[0].get("country") as string;
                resolve(country);
            });
    });
}

export async function getPhoneNumber(request?: Request, slackId?: string): Promise<string | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const phoneNumber = records[0].get("phone") as string;
                resolve(phoneNumber);
            });
    });
}

export async function getJourneyNumber(request?: Request, slackId?: string): Promise<number | null> {
    let id = slackId;
    if (!id) {
        id = await getSlackId(request);
    }
    if (!id) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve(null);
                    return;
                }
                const journeyNumber = records[0].get("journeyNumber") as number;
                resolve(journeyNumber);
            });
    });
}

export async function updateGoldBars(slackId: string, newGoldBarCount: number): Promise<void> {
    let id: string = slackId;
    const currentGoldBars = await getGoldBars(undefined, id);
    if (currentGoldBars === null) {
        throw new Error("User not found");
    }
    if (currentGoldBars === newGoldBarCount) {
        return;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve();
                    return;
                }
                const recordId = records[0].id;
                base("Users").update(recordId, { goldBars: newGoldBarCount }, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
                if (newGoldBarCount > currentGoldBars) {
                    sendUpdateDM(slackId, "Gold Bar Update", `✅ | You have been awarded ${newGoldBarCount - currentGoldBars} gold bars! You now have ${newGoldBarCount} gold bars.`).catch(error => {
                        console.error("Error sending gold bar update DM:", error);
                    });
                } else if (newGoldBarCount < currentGoldBars) {
                    sendUpdateDM(slackId, "Gold Bar Update", `🔻 | You have lost ${currentGoldBars - newGoldBarCount} gold bars. You now have ${newGoldBarCount} gold bars.`).catch(error => {
                        console.error("Error sending gold bar update DM:", error);
                    });
                }
            });
    });
}

export async function createItem(name: string, description: string, price: number, imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
        base("Items").create(
            [
                {
                    fields: {
                        name,
                        description,
                        price,
                        imageUrl,
                    }
                }
            ]
        )
        .then(() => resolve())
        .catch(error => reject(error));
    })
}

export async function deleteItem(itemName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        base("Items")
            .select({ filterByFormula: `{name} = '${itemName}'` })
            .firstPage((error, records) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve();
                    return;
                }
                const recordId = records[0].id;
                base("Items").destroy(recordId, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
    });
}

export async function getOrders(request: Request): Promise<Order[]> {
    const slackId = await getSlackId(request);
    return new Promise((resolve, reject) => {
        base("Users").select({
            filterByFormula: `{slackId} = '${slackId}'`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve({});
                return;
            }
            const results: Record<string, Omit<Order, 'id'>> = {};
            base("Orders").select({
                filterByFormula: `{slackId} = '${slackId}'`
            }).eachPage(
                function page(records: ReadonlyArray<Airtable.Record<Airtable.FieldSet>>, fetchNextPage: () => void) {
                    for (const record of records) {
                        const id = record.get("id") as number;
                        results[id] = {
                            slackId: slackId || "",
                            itemId: record.get("itemId") as string,
                            totalPrice: record.get("totalPrice") as number,
                            address: record.get("address") as string,
                            email: record.get("email") as string,
                            phone: record.get("phone") as string,
                            country: record.get("country") as string,
                            isDayPrize: record.get("isDayPrize") as boolean,
                            status: record.get("status") as "pending" | "shipped" | "delivered" | "cancelled",
                        };
                    }
                    fetchNextPage();
                },
                function done(error: any) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    });
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<void> {
    return new Promise((resolve, reject) => {
        base("Users").select({
            filterByFormula: `{slackId} = '${order.slackId}'`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                reject(new Error("User not found"));
                return;
            }
            const userId = records[0].id;
            
            // look up item by custom id field to get record id
            base("Items").select({
                filterByFormula: `{id} = '${order.itemId}'`
            }).firstPage((itemError, itemRecords) => {
                if (itemError) {
                    reject(itemError);
                    return;
                }
                if (!itemRecords || itemRecords.length === 0) {
                    reject(new Error("Item not found"));
                    return;
                }
                const itemRecordId = itemRecords[0].id;
                const itemName = itemRecords[0].get("name") as string;
                
                base("Orders").create(
                    [
                        {
                            fields: {
                                slackId: [userId],
                                itemId: [itemRecordId],
                                totalPrice: order.totalPrice,
                                isDayPrize: order.isDayPrize,
                                status: order.status,
                            },
                        },
                    ],
                    (createError) => {
                        if (createError) {
                            reject(createError);
                            return;
                        }
                        sendUpdateDM(order.slackId, "Order Confirmation", `An order for \`\`\`${itemName}\`\`\` has been placed successfully!`).catch(error => {
                            console.error("Error sending order confirmation DM:", error);
                        });
                        resolve();
                    }
                );
            });
        });
    });
}

export async function getItemById(itemId: string): Promise<Item | null> {
    return new Promise((resolve, reject) => {
        base("Items").select({
            filterByFormula: `{id} = '${itemId}'`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve(null);
                return;
            }
            const record = records[0];
            const item: Item = {
                id: record.id,
                name: record.get("name") as string,
                description: record.get("description") as string,
                price: record.get("price") as number,
                imageUrl: record.get("imageUrl") as string,
                reward: record.get("reward") as boolean,
            };
            resolve(item);
            });
    })
}

export async function journeyIdToRecordId(journeyId: number): Promise<string | null> {
    return new Promise((resolve, reject) => {
        base("Journeys").select({
            filterByFormula: `{id} = ${journeyId}`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve(null);
                return;
            }
            const recordId = records[0].id;
            resolve(recordId);
        });
    });
}

export async function getJourneyById(journeyId: number): Promise<Journey | null> {
    return new Promise((resolve, reject) => {
        base("Journeys").select({
            filterByFormula: `{id} = ${journeyId}`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve(null);
                return;
            }
            const record = records[0];
            const journey: Journey = {
                id: record.get("id") as number,
                reward: record.get("reward") as string[],
                letter: record.get("letter") as string,
                completers: record.get("completers") as string[],
                theme: record.get("theme") as string,
            };
            resolve(journey);
        });
    });
}  

export async function userSlackIdToUserRecord(slackId: string): Promise<Airtable.Record<Airtable.FieldSet> | null> {
    return new Promise((resolve, reject) => {
        base("Users").select({
            filterByFormula: `{slackId} = '${slackId}'`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve(null);
                return;
            }
            resolve(records[0]);
        });
    });
}

function getFirstOrDefault(value: unknown): string {
    if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
    }
    return typeof value === "string" ? value : "";
}

function submissionRecordToSubmission(record: AirtableRecord<AirtableFieldSet>): Submission {
    return {
        id: record.get("id") as number,
        journeyNumber: record.get("journeyNumber") as number,
        "Hackatime Project name": record.get("Hackatime Project name") as string,
        status: record.get("status") as "unreviewed" | "rejected" | "approved",
        "Optional - Override Hours Spent": record.get("Optional - Override Hours Spent") as number | undefined,
        "Optional - Override Hours Spent Justification": record.get("Optional - Override Hours Spent Justification") as string | undefined,
        "Screenshot": record.get("Screenshot") as string[],
        "Description": record.get("Description") as string,
        "GitHub Username": record.get("GitHub Username") as string,
        "Code URL": record.get("Code URL") as string,
        "Playable URL": record.get("Playable URL") as string,
        "User": getFirstOrDefault(record.get("User")),
        "Slack ID": getFirstOrDefault(record.get("Slack ID")),
        "First Name": getFirstOrDefault(record.get("First Name")),
        "Last Name": getFirstOrDefault(record.get("Last Name")),
        "Email": getFirstOrDefault(record.get("Email")),
        "Country": getFirstOrDefault(record.get("Country")),
        "Address (Line 1)": getFirstOrDefault(record.get("Address (Line 1)")),
        "State / Province": getFirstOrDefault(record.get("State / Province")),
        "City": getFirstOrDefault(record.get("City")),
        "ZIP / Postal Code": getFirstOrDefault(record.get("ZIP / Postal Code")),
        "Birthday": getFirstOrDefault(record.get("Birthday")),
    };
}

export async function getSubmissionBySlackId(slackId: string): Promise<Submission | null> {
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        return null;
    }
    return new Promise((resolve, reject) => {
        base("Submissions").select({
            filterByFormula: `{User} = '${userRecord.id}'`
        }).firstPage((error, records) => {
            if (error) {
                reject(error);
                return;
            }
            if (!records || records.length === 0) {
                resolve(null);
                return;
            }
            resolve(submissionRecordToSubmission(records[0]));
        });
    });
}

export async function addToCompleters(journeyId: number, userRecordId: string): Promise<void> {
    const recordId = await journeyIdToRecordId(journeyId);
    if (!recordId) {
        throw new Error("Journey not found");
    }
    return new Promise((resolve, reject) => {
        base("Journeys").find(recordId, (error, record) => {
            if (error) {
                reject(error);
                return;
            }
            const completers = record.get("completers") as string[] || [];
            if (completers.includes(userRecordId)) {
                resolve();
                return;
            }
            completers.push(userRecordId);
            base("Journeys").update(recordId, { completers }, (updateError) => {
                if (updateError) {
                    reject(updateError);
                    return;
                }
                resolve();
            });
        });
    });
}

export async function updateJourneyNumber(slackId: string, newJourneyNumber: number): Promise<void> {
    let id: string = slackId;
    const currentJourneyNumber = await getJourneyNumber(undefined, id);
    if (currentJourneyNumber === null) {
        throw new Error("User not found");
    }
    if (currentJourneyNumber === newJourneyNumber) {
        return;
    }
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${id}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    resolve();
                    return;
                }
                const recordId = records[0].id;
                base("Users").update(recordId, { journeyNumber: newJourneyNumber }, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
    });
}

export async function sendProjectToReview(slackId: string, journeyNumber: number, HackatimeProjectName: string, screenshotUrl: string, description: string, githubUsername: string, codeUrl: string, playableUrl: string): Promise<string> {
    if (journeyNumber > 7) {
        throw new Error("Congrats on completing the treasure hunt! Stay tuned for future adventures.");
    }
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error("User not found");
    }
    const activeSubmissions: Submission[] = [];
    await new Promise<void>((resolve, reject) => {
        base("Submissions").select({
            filterByFormula: `{User} = '${userRecord.id}'`
        }).eachPage(
            function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
                activeSubmissions.push(...records.map(submissionRecordToSubmission));
                fetchNextPage();
            },
            function done(error: any) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
    if (activeSubmissions.some((submission) => submission.status === "rejected")) {
        throw new Error("One of your projects was rejected. Please update your project and resubmit it before submitting another project.");
    }
    if (activeSubmissions.some((submission) => submission.status === "unreviewed")) {
        throw new Error("You already have a project in review. Please wait for it to be reviewed before submitting another project.");
    }
    const journey = await getJourneyById(journeyNumber);
    if (!journey) {
        throw new Error(`Journey with number ${journeyNumber} not found`);
    }
    const completers = journey.completers || [];
    if (completers.includes(userRecord.id)) {
        throw new Error("You have already completed this journey");
    }

    const submissionId = await new Promise<string>((resolve, reject) => {
        base("Submissions").create(
            [
                {
                    fields: {
                        User: [userRecord.id],
                        journeyNumber,
                        "Hackatime Project name": HackatimeProjectName,
                        status: "unreviewed",
                        "Screenshot": [{ url: screenshotUrl }],
                        "Description": description,
                        "GitHub Username": githubUsername,
                        "Code URL": codeUrl,
                        "Playable URL": playableUrl,
                    } as any
                },
            ],
            (error: unknown, records?: readonly Airtable.Record<Airtable.FieldSet>[]) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    reject(new Error('No submission record returned from Airtable'));
                    return;
                }
                resolve(records[0].id);
            }
        );
    });

    completeJourney(slackId, journeyNumber).catch(error => {
        console.error("Error completing journey:", error);
    });
    sendUpdateDM(slackId, "Project Submitted for Review", `Your project \`\`\`${HackatimeProjectName}\`\`\` has been submitted for review! You should receive feedback within 48 hours.`).catch(error => {
        console.error("Error sending project submission DM:", error);
    });

    return submissionId;

}

export async function createProject(slackId: string, project: Project): Promise<string> {
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error("User not found");
    }
    return new Promise<string>((resolve, reject) => {
        base("Projects").select({
            filterByFormula: `AND({user} = '${userRecord.id}', {journeyNumber} = ${project.journeyNumber})`
        }).firstPage((checkErr, existing) => {
            if (checkErr) { reject(checkErr); return; }
            if (existing?.length) { reject(new Error(`Already have a project for journey ${project.journeyNumber}`)); return; }
            base("Projects").create(
            [
                {
                    fields: {
                        user: [userRecord.id],
                        projectName: project.projectName,
                        description: project.description,
                        codeUrl: project.codeUrl,
                        readmeUrl: project.readmeUrl,
                        demoUrl: project.demoUrl,
                        screenshot: project.screenshot,
                        aiUsage: project.aiUsage,
                        hackatimeProject: project.hackatimeProject,
                        journeyNumber: project.journeyNumber,
                    } as any
                },
            ],
            (error: unknown, records?: readonly Airtable.Record<Airtable.FieldSet>[]) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    reject(new Error('No record returned from Airtable'));
                    return;
                }
                resolve(records[0].id);
            }
        );
        });
    });
}

export async function submitProjectForReview(slackId: string, projectId: string): Promise<void> {
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error("User not found");
    }
    return new Promise<void>((resolve, reject) => {
        // get project records from id, and submitting it to sendProjectToReview
        base("Projects").find(projectId, (error, record) => {
            if (error) {
                reject(error);
                return;
            }
            const project: Project = {
                user: record.get("user") as string,
                status: record.get("status") as "unreviewed" | "rejected" | "approved" | null,
                projectName: record.get("projectName") as string,
                description: record.get("description") as string,
                codeUrl: record.get("codeUrl") as string,
                readmeUrl: record.get("readmeUrl") as string,
                demoUrl: record.get("demoUrl") as string,
                screenshot: record.get("screenshot") as string,
                aiUsage: record.get("aiUsage") as string,
                hackatimeProject: record.get("hackatimeProject") as string,
                journeyNumber: record.get("journeyNumber") as number,
                submission: record.get("submission") as string | null,
                yswsEligible: false,
            };
            const rawYsws = record.get("yswsEligible");
            let normalizedYsws = false;
            if (rawYsws === true) {
                normalizedYsws = true;
            } else if (Array.isArray(rawYsws) && rawYsws.length > 0) {
                const first = rawYsws[0];
                normalizedYsws = first === true || first === 'true' || first === 1 || first === '1';
            } else {
                normalizedYsws = Boolean(rawYsws);
            }
            project.yswsEligible = normalizedYsws;
            if (!project.yswsEligible) {
                reject(new Error("Project is not YSWS eligible"));
                return;
            }
            const githubUsername = project.codeUrl.split("/").slice(-2, -1)[0];
            sendProjectToReview(slackId, project.journeyNumber, project.projectName, project.screenshot, project.description, githubUsername, project.codeUrl, project.demoUrl).then((submissionRecordId) => {
                base("Submissions").find(submissionRecordId, (subFetchErr, submissionRecord) => {
                    if (subFetchErr) {
                        console.error("Error fetching created submission record:", subFetchErr);
                    }
                    base("Projects").update(record.id, { submission: [submissionRecordId] }, (updateError) => {
                        if (updateError) {
                            console.error("Error updating project with submission ID:", updateError);
                            resolve();
                            return;
                        }
                        base("Projects").find(record.id, (projErr, updatedProject) => {
                            if (projErr) {
                                console.error("Error fetching updated project record:", projErr);
                            }
                            resolve();
                        });
                    });
                });
            }).catch(error => {
                reject(error);
            });
        });
    });
}