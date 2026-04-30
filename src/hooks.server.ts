import { getSlackId, isAdmin } from "$lib/db/airtableClient";
import { HCA_CLIENT_ID, HCA_CLIENT_SECRET } from "$env/static/private";
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    let slackId = await getSlackId(event.request);
    const cookieHeader = event.request.headers.get("cookie") || "";
    const hasRefresh = cookieHeader.includes("refresh_token=");
    const hasAccess = cookieHeader.includes("access_token=");

    if (!slackId && hasRefresh && !hasAccess) {
        const refreshToken = cookieHeader.split("refresh_token=")[1]?.split(";")[0];
        if (refreshToken) {
            const refreshUrl = "https://auth.hackclub.com/oauth/token";
            try {
                const refreshResponse = await fetch(refreshUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "client_id": HCA_CLIENT_ID,
                        "client_secret": HCA_CLIENT_SECRET,
                        refresh_token: refreshToken,
                        grant_type: "refresh_token",
                    })
                });
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    const newAccessToken = refreshData.access_token;
                    const newRefreshToken = refreshData.refresh_token;
                    const setCookie = `access_token=${newAccessToken}; Path=/; HttpOnly; SameSite=Lax, refresh_token=${newRefreshToken}; Path=/; HttpOnly; SameSite=Lax`;
                    event.request.headers.set('cookie', `access_token=${newAccessToken}; refresh_token=${newRefreshToken}`);
                    slackId = await getSlackId(event.request);
                    const response = await resolve(event);
                    response.headers.set('set-cookie', setCookie);
                    return response;
                } else {
                    console.error("Error refreshing access token:", await refreshResponse.text());
                    return new Response("Error refreshing access token", { status: 500 });
                }
            } catch (error) {
                console.error("Error refreshing access token:", error);
                return new Response("Error refreshing access token", { status: 500 });
            }
        }
    }

    if (event.url.pathname.startsWith('/api/')) {
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
