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
                            url: "https://treasure.peleg2210.me",
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error("Error sending DM:", error);
    }
}