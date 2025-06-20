function main() {
    checkRssFeed("https://www.city.utsunomiya.lg.jp/news.rss", DISCORD_WEBHOOK_URL);
}

function checkRssFeed(rssUrl, discordWebhookUrl) {
    // スクリプトプロパティから前回読み取った最新の item の時間を取得
    var scriptProperties = PropertiesService.getScriptProperties();
    var lastExecutionTime = scriptProperties.getProperty(`lastTime-${rssUrl}`);

    // RSS フィードを取得し、XML を解析します
    var response = UrlFetchApp.fetch(rssUrl);
    var xml = XmlService.parse(response.getContentText());

    // 各配信アイテムを処理します
    var items = xml.getRootElement().getChild('channel').getChildren('item');
    var newItems = [];

    for (const item of items) {
        var pubDate = new Date(item.getChild('pubDate').getText());

        // 前回の実行時間以降の配信を検出します
        if (!lastExecutionTime || pubDate > new Date(lastExecutionTime)) {
            newItems.push({
                link: item.getChild('link').getText(),
                title: item.getChild('title').getText(),
                description: item.getChild('description').getText(),
                pubDate: pubDate
            });
        }
    }

    // 新しい配信がない場合は return
    if (newItems.length < 1) return;

    // スクリプトプロパティに読み取った最新の item の時間を保存
    scriptProperties.setProperty(`lastTime-${rssUrl}`, newItems[0].pubDate.toISOString());

    // 配列の要素の順番を破壊的に反転 (古い item から読み込まれるようにするため)
    newItems.reverse();

    for (const item of newItems) {
        Logger.log(item);
        sendDiscord(discordWebhookUrl, item);
        // Discord レート制限対策のため待機
        Utilities.sleep(RETRY_DELAY_MS);
    }
}