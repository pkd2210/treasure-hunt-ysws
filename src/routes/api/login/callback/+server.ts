
import { HCA_CLIENT_ID, HCA_CLIENT_SECRET } from "$env/static/private";
import { isUser, addUser } from "$lib/db/airtableClient";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const authCode = url.searchParams.get("code");

    // post request to hca to exchange auth code for access token
    let tokenResponse;
    try {
        tokenResponse = await fetch("https://auth.hackclub.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: HCA_CLIENT_ID,
                client_secret: HCA_CLIENT_SECRET,
                code: authCode,
                redirect_uri: url.origin + url.pathname,
                grant_type: "authorization_code"
            })
        });
    } catch (error) {
        console.error("Error fetching access token:", error);
        return new Response("Error fetching access token", { status: 500 });
    }

    if (!tokenResponse.ok) {
        console.error("Error response from token endpoint:", await tokenResponse.text());
        return new Response("Error fetching access token", { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // get the user info from /api/v1/me
    let userResponse;
    try {
        userResponse = await fetch("https://auth.hackclub.com/api/v1/me", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return new Response("Error fetching user info", { status: 500 });
    }

    if (!userResponse.ok) {
        console.error("Error response from user info endpoint:", await userResponse.text());
        return new Response("Error fetching user info", { status: 500 });
    }

    const userData = await userResponse.json();
    const slackId = userData.slack_id || (userData.identity && userData.identity.slack_id);

    if (!slackId) {
        console.error("No slack_id in user data:", userData);
        return new Response("No slack_id in user data", { status: 500 });
    }

    const userExists = await isUser(slackId);
    if (!userExists) {
        await addUser({
            slackId,
            goldBars: 0,
            firstName: userData.first_name || (userData.identity && userData.identity.first_name) || "",
            lastName: userData.last_name || (userData.identity && userData.identity.last_name) || "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            email: userData.email || (userData.identity && userData.identity.primary_email) || "",
            phone: "",
            country: "",
            admin: false,
            reviewer: false,
            birthday: "",
            journeyNumber: 1,
        });
    }


    const response = new Response("Login successful", {
        status: 302,
        headers: {
            "Location": "/"
        }
    });
    response.headers.append("Set-Cookie", `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`);
    response.headers.append("Set-Cookie", `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
    return response;
}
