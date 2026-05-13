import { App } from "@slack/bolt";
import { SLACK_APP_TOKEN, SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from "$env/static/private";

let slackClient: App | null = null;

function getSlackClient(): App {
    if (!slackClient) {
        slackClient = new App({
            token: SLACK_BOT_TOKEN,
            signingSecret: SLACK_SIGNING_SECRET,
            appToken: SLACK_APP_TOKEN,
            socketMode: false,
        });
    }
    return slackClient;
}

export async function sendUpdateDM(slackId: string, title: string, message: string) {
    try {
        const client = getSlackClient();
        await client.client.chat.postMessage({
            channel: slackId,
            text: `New message in category ${title}: ${message}`,
            unfurl_links: false,
            unfurl_media: false,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "New message from Treasure Hunt!",
                        emoji: true,
                    },
                },
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: title,
                        emoji: true,
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message,
                    },
                },
                {
                    type: "divider",
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "Open Treasure Hunt",
                                emoji: true,
                            },
                            value: "open_treasure_hunt",
                            url: "https://treasure.peleg2210.tech/dashboard",
                        },
                    ],
                }, 
                {
                    type: "context",
                    elements: [
                        {
                            type: "image",
                            image_url: "https://avatars.slack-edge.com/2025-10-10/9661249810775_dc9547e59052a3bf013f_512.png",
                            alt_text: "peleg2210 logo",
                        },
                        {
                            type: "mrkdwn",
                            text: "If you need any help, fell free to contact me <https://hackclub.slack.com/team/U091DE0M4NB|@peleg2210>"
                        }
                    ],
                },
            ],
        });
    } catch (error) {
        console.error("Error sending DM:", error);
    }
}