import { getRewards } from "$lib/db/airtableClient";
import type { Reward } from "$lib/db/models";
let rewards: Reward[] = [];

rewards = await getRewards();

export function GET() {
    return new Response(JSON.stringify(rewards), {
        headers: { 'Content-Type': 'application/json' },
    });
}