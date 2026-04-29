import Airtable from "airtable";
import type { Item, Reward, User } from "./models";
import { AIRTABLE_KEY, AIRTABLE_BASE_ID } from '$env/static/private';
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE_ID);

export function getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
        const results: Item[] = [];
        base("Items").select().eachPage(
            function page(records, fetchNextPage) {
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
            function done(error) {
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
            function page(records, fetchNextPage) {
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
            function done(error) {
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

export function isAdmin(slackId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${slackId}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
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

export function isUser(slackId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        base("Users")
            .select({ filterByFormula: `{slackId} = '${slackId}'` })
            .firstPage((error, records: readonly Airtable.Record<Airtable.FieldSet>[] = []) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(records && records.length > 0);
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