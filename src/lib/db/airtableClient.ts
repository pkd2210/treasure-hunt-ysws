import AirtablePkg from "airtable";
import type { AirtableFieldSet, AirtableRecord } from './airtable-types';
const Airtable = AirtablePkg;
import type { Item, Reward, User } from "./models";
import { AIRTABLE_KEY, AIRTABLE_BASE_ID } from '$env/static/private';
import type Airtable from "airtable";
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

export function getRewards(): Promise<Reward[]> {
    return new Promise((resolve, reject) => {
        const results: Reward[] = [];
        base("Rewards").select().eachPage(
            function page(records: ReadonlyArray<AirtableRecord<AirtableFieldSet>>, fetchNextPage: () => void) {
                for (const record of records) {
                    results.push({
                        day: record.get("day") as string,
                        prizeName: record.get("prizeName") as string,
                        prizeDescription: record.get("prizeDescription") as string,
                        prizeImageUrl: record.get("prizeImageUrl") as string,
                    })
                }
                fetchNextPage();    
            },
            function done(error: any) {
                if (error) {
                    reject(error);
                } else {
                    results.sort((a, b) => {
                        const getStartDay = (dayStr: string) => parseInt(dayStr.split(' - ')[0], 10);
                        return getStartDay(a.day) - getStartDay(b.day);
                    });
                    resolve(results);
                }
            }
        );
    });
}

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
                        address: user.address || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        country: user.country || "",
                        admin: false,
                        reviewer: false,
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
    });
}

export function getSlackId(request: Request): string | null {
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

    // get the user info from /api/v1/me
    return fetch("https://auth.hackclub.com/api/v1/me", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error fetching user info");
        }
        return response.json();
    })
    .then(userData => {
        return userData.slack_id || (userData.identity && userData.identity.slack_id) || null;
    })
    .catch(error => {
        console.error("Error fetching user info:", error);
        return null;
    });
}

export async function getFirstName(request: Request, slackId?: string): Promise<string | null> {
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

export async function getLastName(request: Request, slackId?: string): Promise<string | null> {
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

export async function getGoldBars(request: Request, slackId?: string): Promise<number | null> {
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

export async function getHomeAddress(request: Request, slackId?: string): Promise<string | null> {
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
                const address = records[0].get("address") as string;
                resolve(address);
            });
    });
}

export async function getEmailAddress(request: Request, slackId?: string): Promise<string | null> {
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

export async function getCountry(request: Request, slackId?: string): Promise<string | null> {
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

export async function getPhoneNumber(request: Request, slackId?: string): Promise<string | null> {
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

export async function updateGoldBars(slackId: string, newGoldBarCount: number): Promise<void> {
    let id: string = slackId;
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