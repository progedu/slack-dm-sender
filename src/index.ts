'use strict';
import * as fs from 'fs';
// WebAPI Method について → https://api.slack.com/methods
// Slack SDK WebAPI について → https://slack.dev/node-slack-sdk/web-api
import { WebClient, WebAPICallResult } from '@slack/web-api';

// メイン処理
(async () => {
  const token = process.env.SLACK_TOKEN;
  if (!token) {
    console.log(`[ERROR] 環境変数 SLACK_TOKEN が設定されていません。`);
    return;
  }

  const emailsFile = process.env.EMAILS_FILE || './emails.csv';
  const templateFile = process.env.DM_TEMPLATE_FILE || './dm_template.txt';

  const web = new WebClient(token);
  const emailsArray: Array<Array<string>> = fs
    .readFileSync(emailsFile)
    .toString('utf-8')
    .split('\n')
    .map((line) => line.split(','));
  const templateString = fs.readFileSync(templateFile).toString('utf-8');

  console.log(`[INFO] 全 ${emailsArray.length} 件の処理を開始します。`);
  let counter = 0;
  for (const emails of emailsArray) {
    const users: Array<LookupByEmailResult> = [];
    for (const email of emails) {
      try {
        const rookupByEmailResult = (await web.users.lookupByEmail({
          email: email.trim(),
        })) as LookupByEmailResult;
        users.push(rookupByEmailResult);
      } catch (err) {
        console.log(
          `[ERROR] users.lookupByEmail APIの実行エラー email: ${email} err: ${err}`
        );
      }
    }

    // テンプレートへのメンションの置き換え
    let text = templateString;
    users.forEach((e, i) => {
      text = text.replace(`{${i}}`, `<@${users[i].user.id}>`);
    });

    const usersString = users.map((u) => u.user.id).join(',');
    try {
      const conversationsOpenResult = (await web.conversations.open({
        users: usersString,
      })) as ConversationsOpenResult;

      try {
        await web.chat.postMessage({
          channel: conversationsOpenResult.channel.id,
          text: text,
        });
        console.log(
          `[INFO] emails: ${emails.join(',')} へのDM送信に成功しました。`
        );
      } catch (err) {
        console.log(
          `[ERROR] chat.postMessage APIの実行エラー channel: ${conversationsOpenResult.channel.id} err: ${err}`
        );
      }
    } catch (err) {
      console.log(
        `[ERROR] conversations.open APIの実行エラー usersString: ${usersString} err: ${err}`
      );
    }
    counter++;
  }
  console.log(`[INFO] 全 ${counter} 件の処理を終えました。`);
})();

interface LookupByEmailResult extends WebAPICallResult {
  user: {
    id: string;
    name: string;
  };
}

interface ConversationsOpenResult extends WebAPICallResult {
  channel: {
    id: string;
  };
}
