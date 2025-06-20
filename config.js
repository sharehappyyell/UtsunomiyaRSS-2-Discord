const DISCORD_WEBHOOK_URL = "Discord Webhook URL";

const MAX_RETRIES = 5; // 最大再試行回数
const RETRY_DELAY_MS = 3000; // 再送までの遅延時間 (ミリ秒)

// Discordに送信される payload
const payload = item => {
    return {
        "embeds": [
            {
                "title": `${item.title}`,
                "description": `${item.description}`,
                "url": `${item.link}`,
                "color": 42792
            }
        ]
    }
}