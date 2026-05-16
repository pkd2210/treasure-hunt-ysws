import AirtablePkg from "airtable";
import type { AirtableFieldSet, AirtableRecord } from './airtable-types';
const Airtable = AirtablePkg;
import type { Item, Journey, Order, Reward, User, Submission, Project } from "./models";
import { AIRTABLE_KEY, AIRTABLE_BASE_ID } from '$env/static/private';
import { sendUpdateDM } from "$lib/server/slack/slackClient";
import { completeJourney } from "$lib/rewards/complete";
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE_ID);

// General get records
async function getUserRecords(slackId?: string, request?: Request): Promise<AirtableRecord<AirtableFieldSet> | null> {
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
                resolve(records[0]);
            })
    })

    // return a template record for testing without airtable access
    // keep this as a simple mock object but cast it to the AirtableRecord type
    // DON'T DELETE THE COMMENTS
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    /*return Promise.resolve({
        id: "rec123",
        get: (fieldName: string) => {
            const mockData: Record<string, any> = {
                slackId: "U091DE0M4NB",
                goldBars: 2500,
                firstName: "Peleg",
                lastName: "User",
                address1: "123 Test St",
                address2: "SECEND ADDRESS",
                city: "Testville",
                state: "TS",
                zip: "12345",
                email: "pkd2210@gmail.com",
                phone: "555-1234",
                country: "Testland",
                admin: true,
                reviewer: true,
                journeyNumber: 1,
            };
            // return undefined for unknown fields to mirror Airtable behavior
            return mockData.hasOwnProperty(fieldName) ? mockData[fieldName] : undefined;
        }
    } as unknown as AirtableRecord<AirtableFieldSet>);*/
}

// User Get functions

export async function getSlackId(request?: Request): Promise<string> {
    if (!request) return "";
    const cookieHeader = request.headers.get("cookie") || "";
    const accessToken = cookieHeader.includes("access_token=")
        ? cookieHeader.split("access_token=")[1].split(";")[0]
        : undefined;
    if (!accessToken) return "";
    try {
        const resp = await fetch("https://auth.hackclub.com/api/v1/me", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        if (!resp.ok) return "";
        const data = await resp.json();
        return data.slack_id || (data.identity && data.identity.slack_id) || "";
    } catch (err) {
        console.error("Error fetching slack id from auth API:", err);
        return "";
    }
}

export async function getFirstName(request?: Request, slackId?: string): Promise<string> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return "";
    }
    return user.get("firstName") as string;
}

export async function getLastName(request?: Request, slackId?: string): Promise<string> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return "";
    }
    return user.get("lastName") as string;
}

export async function getGoldBars(request?: Request, slackId?: string): Promise<number> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return 0;
    }
    return user.get("goldBars") as number;
}

export async function getAddress(request?: Request, slackId?: string): Promise<{ address1: string; address2: string; city: string; state: string; zip: string }> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return { address1: "", address2: "", city: "", state: "", zip: "" };
    }
    return {
        address1: user.get("address1") as string,
        address2: user.get("address2") as string,
        city: user.get("city") as string,
        state: user.get("state") as string,
        zip: user.get("zip") as string
    };
}

export async function getEmailAddress(request?: Request, slackId?: string): Promise<string> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return "";
    }
    return user.get("email") as string;
}

export async function getCountry(request?: Request, slackId?: string): Promise<string> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return "";
    }
    return user.get("country") as string;
}

export async function getPhoneNumber(request?: Request, slackId?: string): Promise<string> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return "";
    }
    return user.get("phone") as string;
}

export async function getJourneyNumber(request?: Request, slackId?: string): Promise<number> {
    const user = await getUserRecords(slackId, request);
    if (!user) {
        return 0;
    }
    return user.get("journeyNumber") as number;
}

export function getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
        const results: Item[] = [];
        base("Items").select().eachPage(
            function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
                for (const record of records) {
                    results.push({
                        recId: record.id,
                        id: record.get("id") as string,
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
    // return mock items for testing without airtable access
    /*return Promise.resolve([
        {
            recId: "rec123",
            id: "item123",
            name: "Test Item",
            description: "This is a test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1233",
            id: "item1233",
            name: "Test Item 2",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1235",
            id: "item1235",
            name: "Test Item 3",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1237",
            id: "item1237",
            name: "Test Item 3",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1236",
            id: "item1236",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec12371",
            id: "item12371",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1238",
            id: "item1238",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec1239",
            id: "item1239",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec12310",
            id: "item12310",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec12311",
            id: "item12311",
            name: "Test Item 4",
            description: "This is another test item.",
            price: 100,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: false,
        },
        {
            recId: "rec456",
            id: "item456",
            name: "Test Reward",
            description: "This is a test reward.",
            price: 0,
            imageUrl: "https://cdn.hackclub.com/019d96d5-93a7-730d-84bf-1678f0f8b295/4apvimfttbw80qm0lp616ofwez6put538415.avif",
            reward: true,
        }
    ]);*///
}

// Is user functions
export async function isUser(slackId?: string, request?: Request): Promise<boolean> {
    const user = await getUserRecords(slackId, request);
    return user != null;
}

export async function isAdmin(slackId?: string, request?: Request): Promise<boolean> {
    const user = await getUserRecords(slackId, request);
    if (!user) return false;
    return Boolean(user.get("admin"));

}

export async function isReviewer(slackId?: string, request?: Request): Promise<boolean> {
    const user = await getUserRecords(slackId, request);
    if (!user) return false;
    return Boolean(user.get("reviewer"));
}

// User Management functions
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
            .firstPage((error, records: readonly AirtableRecord<AirtableFieldSet>[] = []) => {
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
            .firstPage((error, records: readonly AirtableRecord<AirtableFieldSet>[] = []) => {
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
// Item management functions
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

// Item management functions
export async function getItemById(itemId: string): Promise<Item | null> { // deprecated
    return getItem(itemId, undefined);
}

export async function getItem(itemId?: string, itemName?: string): Promise<Item | null> {
    return new Promise((resolve, reject) => {
        let filterFormula = "";
        if (itemId) {
            filterFormula = `{id} = '${itemId}'`;
        } else if (itemName) {
            filterFormula = `{name} = '${itemName}'`;
        } else {
            resolve(null);
            return;
        }

        base("Items").select({
            filterByFormula: filterFormula
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
                recId: record.id,
                id: record.id,
                name: record.get("name") as string,
                description: record.get("description") as string,
                price: record.get("price") as number,
                imageUrl: record.get("imageUrl") as string,
                reward: record.get("reward") as boolean,
            };
            resolve(item);
        });
    });
}

// Order management functions
export async function getOrders(request: Request): Promise<Record<string, Omit<Order, 'id'>>> {
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
            const userRecordId = records[0].id;
            const results: Record<string, Omit<Order, 'id'>> = {};
            base("Orders").select({
                filterByFormula: `{slackId} = '${userRecordId}'`
            }).eachPage(
                function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
                    for (const record of records) {
                        const id = record.get("id") as number;
                        results[id] = {
                            slackId: slackId || "",
                            itemId: record.get("itemId") as string,
                            amount: record.get("amount") as number,
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
                                amount: order.amount,
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
                        sendUpdateDM(order.slackId, "Order Confirmation", `An order for \`\`\`${itemName}\`\`\` x${order.amount} has been placed successfully!`).catch(error => {
                            console.error("Error sending order confirmation DM:", error);
                        });
                        resolve();
                    }
                );
            });
        });
    });
}

// Journey management functions
export async function journeyIdToRecordId(journeyId: number): Promise<string | null> { // deprecated
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

export async function getJourneyById(journeyId?: number, journeyRecordId?: string): Promise<Journey | null> {
    return new Promise((resolve, reject) => {
        let filterFormula = "";
        if (journeyId !== undefined) {
            filterFormula = `{id} = ${journeyId}`;
        } else if (journeyRecordId !== undefined) {
            filterFormula = `{id} = '${journeyRecordId}'`;
        } else {
            resolve(null);
            return;
        }

        base("Journeys").select({
            filterByFormula: filterFormula
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

export async function userSlackIdToUserRecord(slackId: string): Promise<AirtableRecord<AirtableFieldSet> | null> { // deprecated
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

export async function userRecordIdToSlackId(recordId: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        base("Users").find(recordId, (error, record) => {
            if (error) {
                reject(error);
                return;
            }
            const slackId = record?.get("slackId") as string | undefined;
            resolve(slackId || null);
        });
    });
}

// Submittion workflow
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
            (error: unknown, records?: readonly AirtableRecord<AirtableFieldSet>[]) => {
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
                    (error: unknown, records?: readonly AirtableRecord<AirtableFieldSet>[]) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!records || records.length === 0) {
                    reject(new Error('No record returned from Airtable'));
                    return;
                }
                sendUpdateDM(slackId, "Project Created", `Your project for Journey ${project.journeyNumber} has been created! You can update it or submit it for review when you're ready.`).catch(error => {
                    console.error("Error sending project creation DM:", error);
                });
                resolve(records[0].id);
            }
        );
        });
    });
}

export async function updateProject(slackId: string, journeyNumber: number, updatedFields: Partial<Omit<Project, "journeyNumber" | "user">>): Promise<void> {
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error("User not found");
    }
    return new Promise<void>((resolve, reject) => {
        base("Projects").select({
            filterByFormula: `{journeyNumber} = ${journeyNumber}`
        }).firstPage((checkErr, records) => {
            if (checkErr) { reject(checkErr); return; }
            if (!records || records.length === 0) { reject(new Error(`No project found for journey ${journeyNumber}`)); return; }
            
            // Verify this project belongs to the user
            const project = records[0];
            const users = project.get("user") as string[];
            if (!users || !Array.isArray(users) || !users.includes(userRecord.id)) {
                reject(new Error("You do not have permission to update this project"));
                return;
            }
            
            const recordId = project.id;
            base("Projects").update(recordId, updatedFields as any, (updateErr: unknown) => {
                if (updateErr) {
                    reject(updateErr);
                    return;
                }
                sendUpdateDM(slackId, "Project Updated", `Your project for Journey ${project.get("journeyNumber")} has been updated!`).catch(error => {
                    console.error("Error sending project update DM:", error);
                });
                resolve();
            });
        });
    });
}

export async function getProjects(request?: Request, slackId?: string): Promise<Project[]> {
    // Resolve slackId from request when only request context is provided.
    if (!slackId && request) {
        slackId = await getSlackId(request);
    }

    // use userSlackIdToUserRecord if slackId is provided to get user record, then filter projects by user record id
    let userRecord: AirtableRecord<AirtableFieldSet> | null = null;
    if (slackId) {
        userRecord = await userSlackIdToUserRecord(slackId);
        if (!userRecord) {
            throw new Error("User not found");
        }
    }
    return new Promise<Project[]>((resolve, reject) => {
        const collected: AirtableRecord<AirtableFieldSet>[] = [];
        base("Projects").select().eachPage(
            (records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) => {
                collected.push(...records);
                fetchNextPage();
            },
            (err: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                const visibleRecords = userRecord
                    ? collected.filter((record) => {
                        const users = record.get("user") as string[] | undefined;
                        return Array.isArray(users) && users.includes(userRecord.id);
                    })
                    : collected;

                const projects: Project[] = visibleRecords.map((record) => ({
                    // put the recordId
                    id: record.id as string,
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
                }));
                resolve(projects);
            }
        );
    });

    // return mock projects for testing without airtable access
    /*return Promise.resolve([
        {
            user: userRecord ? userRecord.id : "rec123",
            status: "UNSHIPPED",
            name: "Journey 1 Mock Project",
            description: "This is a mock project for journey 1.",
            codeUrl: "https://github.com/hackclub/ysws-mock-project-1",
            readmeUrl: "https://github.com/hackclub/ysws-mock-project-1/blob/main/README.md",
            demoUrl: "https://hackclub.github.io/ysws-mock-project-1",
            screenshot: "https://example.com/screenshot-1.png",
            aiUsage: "No AI usage",
            hackatimeProject: "Mock Hackatime Project 1",
            journeyNumber: 1,
            submission: null,
            yswsEligible: false,
        },
        {
            user: userRecord ? userRecord.id : "rec123",
            status: "APPROVED",
            name: "Journey 2 Mock Project",
            description: "This is a mock project for journey 2.",
            codeUrl: "https://github.com/hackclub/ysws-mock-project-2",
            readmeUrl: "https://github.com/hackclub/ysws-mock-project-2/blob/main/README.md",
            demoUrl: "https://hackclub.github.io/ysws-mock-project-2",
            screenshot: "https://example.com/screenshot-2.png",
            aiUsage: "No AI usage",
            hackatimeProject: "Mock Hackatime Project 2",
            journeyNumber: 2,
            submission: null,
            yswsEligible: false,
        },
        {
            user: userRecord ? userRecord.id : "rec123",
            status: "APPROVED",
            name: "Journey 3 Mock Project",
            description: "This is a mock project for journey 3.",
            codeUrl: "https://github.com/hackclub/ysws-mock-project-3",
            readmeUrl: "https://github.com/hackclub/ysws-mock-project-3/blob/main/README.md",
            demoUrl: "https://hackclub.github.io/ysws-mock-project-3",
            screenshot: "https://example.com/screenshot-3.png",
            aiUsage: "No AI usage",
            hackatimeProject: "Mock Hackatime Project 3",
            journeyNumber: 3,
            submission: null,
            yswsEligible: false,
        },
        {
            user: userRecord ? userRecord.id : "rec123",
            status: "APPROVED",
            name: "Journey 4 Mock Project",
            description: "This is a mock project for journey 4.",
            codeUrl: "https://github.com/hackclub/ysws-mock-project-4",
            readmeUrl: "https://github.com/hackclub/ysws-mock-project-4/blob/main/README.md",
            demoUrl: "https://hackclub.github.io/ysws-mock-project-4",
            screenshot: "https://example.com/screenshot-4.png",
            aiUsage: "No AI usage",
            hackatimeProject: "Mock Hackatime Project 4",
            journeyNumber: 4,
            submission: null,
            yswsEligible: false,
        }
    ]);*///
}

export async function submitProjectForReview(slackId: string, projectId: string): Promise<void> {
    const userRecord = await userSlackIdToUserRecord(slackId);
    if (!userRecord) {
        throw new Error("User not found");
    }
    return new Promise<void>((resolve, reject) => {
        // get project records from id, and submitting it to sendProjectToReview
        base("Projects").find(projectId, async (error, record) => {
            if (error || !record) {
                reject(error);
                return;
            }
            const rawScreenshot = record.get("screenshot") as any;
            let screenshotUrl = "";
            if (typeof rawScreenshot === "string") {
                screenshotUrl = rawScreenshot;
            } else if (Array.isArray(rawScreenshot) && rawScreenshot.length > 0) {
                const first = rawScreenshot[0];
                if (typeof first === "string") {
                    screenshotUrl = first;
                } else if (first && typeof first === "object") {
                    screenshotUrl = first.url || first.thumbnails?.full?.url || first.thumbnails?.large?.url || "";
                }
            }

            const project: Project = {
                id: record.id,
                user: record.get("user") as string,
                status: record.get("status") as "unreviewed" | "rejected" | "approved" | null,
                projectName: record.get("projectName") as string,
                description: record.get("description") as string,
                codeUrl: record.get("codeUrl") as string,
                readmeUrl: record.get("readmeUrl") as string,
                demoUrl: record.get("demoUrl") as string,
                screenshot: screenshotUrl,
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

            if (!project.codeUrl || typeof project.codeUrl !== "string") {
                reject(new Error("Project is missing a code URL. Please update your project before submitting."));
                return;
            }

            if (!project.screenshot || typeof project.screenshot !== "string") {
                reject(new Error("Project is missing a screenshot URL. Please update your project before submitting."));
                return;
            }

            // check if project was submitted to another ysws already
            const manifestUrl = "https://manifest.hackclub.com/api/lookup?codeUrl=";
            const finalUrl = manifestUrl + encodeURIComponent(project.codeUrl);
            try {
                const response = await fetch(finalUrl);
                const data = await response.json();
                // Manifest responses have varied shapes historically. Be tolerant:
                // - { submissions: [...] }
                // - [...] (top-level array)
                // - other object shapes
                let submissions: unknown[] = [];
                if (Array.isArray(data)) {
                    submissions = data as unknown[];
                } else if (data && typeof data === 'object') {
                    // prefer data.submissions when available
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (Array.isArray(data.submissions)) submissions = data.submissions;
                    else {
                        // try to discover any array-valued property that looks like submissions
                        for (const key of Object.keys(data)) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            if (Array.isArray(data[key])) {
                                // pick the first reasonable array we find
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                submissions = data[key];
                                break;
                            }
                        }
                    }
                }

                if (Array.isArray(submissions) && submissions.length > 0) {
                    reject(new Error("This project has already been submitted for another YSWS"));
                    return;
                }
            } catch (err) {
                console.error("Error checking manifest for duplicate submission");
                reject(new Error("Error checking project submission status. Please try again later."));
                return;
            }
            const githubMatch = project.codeUrl.match(/github\.com\/([^/]+)/i);
            const githubUsername = githubMatch?.[1] || "";
            if (!githubUsername) {
                reject(new Error("Project code URL must be a GitHub repository URL before submission."));
                return;
            }
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

export async function getJourneyLetter(journeyId: number): Promise<string | null> {
    if (!Number.isFinite(journeyId)) {
        throw new Error("Invalid journey id");
    }

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
            const letter = records[0].get("letter") as string;
            resolve(letter);
        });
    });
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
            if (error || !record) {
                reject(error ?? new Error("Journey not found"));
                return;
            }
            const completers = (record.get("completers") as string[]) || [];
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
// others
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

// gallery
export async function getAllApprovedProjects(): Promise<Project[]> {
    return new Promise<Project[]>((resolve, reject) => {
        const collected: AirtableRecord<AirtableFieldSet>[] = [];
        base("Projects").select({
            filterByFormula: `{status} = 'approved'`
        }).eachPage(
            (records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) => {
                collected.push(...records);
                fetchNextPage();
            },
            (err: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                const projects: Project[] = collected.map((record) => ({
                    id: record.id as string,
                    user: record.get("user") as string,
                    projectName: record.get("projectName") as string,
                    description: record.get("description") as string,
                    codeUrl: record.get("codeUrl") as string,
                    readmeUrl: record.get("readmeUrl") as string,
                    demoUrl: record.get("demoUrl") as string,
                    screenshot: record.get("screenshot") as string,
                    hackatimeProject: record.get("hackatimeProject") as string,
                    journeyNumber: record.get("journeyNumber") as number,
                }));
                resolve(projects);
            }
        );
    });
}