function sendDiscord(url, item) {

    const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload(item)) // payload関数は別途定義されているものとします
    };

    for (let retries = 0; retries <= MAX_RETRIES; retries++) {
        try {
            const response = UrlFetchApp.fetch(url, options);
            const responseCode = response.getResponseCode();

            if (responseCode === 204) {
                Logger.log('Discordへのメッセージ送信が成功しました (Code 204)。');
                return; // 成功したら関数を終了
            } else {
                Logger.log(`Discordへのメッセージ送信が失敗しました。レスポンスコード: ${responseCode}`);
            }
        } catch (e) {
            Logger.log(`Discordへのメッセージ送信中にエラーが発生しました: ${e.message}`);
        }

        if (retries < MAX_RETRIES) {
            Logger.log(`${RETRY_DELAY_MS / 1000}秒後に再送を試みます... (試行回数: ${retries + 1}/${MAX_RETRIES})`);
            Utilities.sleep(RETRY_DELAY_MS);
        } else {
            Logger.log(`最大再試行回数 (${MAX_RETRIES}回) に達したため、再送を中止します。`);
        }
    }
}