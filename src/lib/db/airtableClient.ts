import AirtablePkg from "airtable";
import type { AirtableFieldSet, AirtableRecord } from './airtable-types';
const Airtable = AirtablePkg;
import type { Item, Order, Reward, User } from "./models";
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
        const slackId = userData.slack_id || (userData.identity && userData.identity.slack_id) || null;
        return slackId;
    })
    .catch(() => {
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