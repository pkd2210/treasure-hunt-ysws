import { getSlackId, isAdmin } from "$lib/db/airtableClient";
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Restrict all /api/admin/* endpoints to admins only
    if (event.url.pathname.startsWith('/api/admin/')) {
        const slackId = await getSlackId(event.request);
        if (!slackId || !(await isAdmin(slackId))) {
            return new Response('Unauthorized', { status: 401 });
        }
    }
    return resolve(event);
};
