import { getSlackId, isAdmin } from "$lib/db/airtableClient";
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api/')) {
        const slackId = await getSlackId(event.request);
        if (!slackId) {
            return new Response('Not loggedin', { status: 401 });
        }

        if (event.url.pathname.startsWith('/api/admin/')) {
            if (!(await isAdmin(slackId))) {
                return new Response('Unauthorized', { status: 401 });
            }
        }
    }
    return resolve(event);
};
