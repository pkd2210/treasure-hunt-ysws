import { redirect } from "@sveltejs/kit";
import { HCA_CLIENT_ID, HCA_REDIRECT_ADDRESS } from "$env/static/private";

export function GET() {
    throw redirect(302, `https://auth.hackclub.com/oauth/authorize?client_id=${HCA_CLIENT_ID}&redirect_uri=${HCA_REDIRECT_ADDRESS}/api/login/callback&response_type=code&scope=openid email name profile verification_status slack_id`);
}