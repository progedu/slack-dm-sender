# slack-dm-sender

Slack 向けのDMの差し込み送信スクリプト

# 機能について

このスクリプトでは、カンマ区切りの複数emailアドレスのリストと、ユーザー名を差し込めるテンプレートからダイレクトメールを送信を行います。

# 使い方

### 1. インストール

まず、このスクリプトを GitHub よりダウンロードします。
その後、[Node.js](https://nodejs.org/ja/) をインストール (v14.16.0 LTS 以上)します。
Windows の方は、Windows 用、Mac の方は Mac 用のものをインストールしてください。

コンソール(Windows の場合には PowerShell をメニューから立ち上げて)、ダウンロードして解凍したフォルダ内にて

```
cd slack-dm-sender
npm i
```

以上を実行。必要なライブラリをインストールします。エラーが出ないことを確認して下さい。

### 2. OAuth Access Token の取得 と必要な招待

次に、 [Slack App](https://api.slack.com/apps) より

- chat:write
- channels:write
- groups:write
- im:write
- mpim:write
- users:read
- users:read.email

の権限を持つ App を作成し、OAuth Access Token (BotトークンではなくUserトークン)を取得します。
上の権限をAppのPermissionで設定してワークスペースにインストールし

```
xoxp-99999999-99999999-hogehoge-fugafuga
```

以上の形式のトークンを取得します。テキストとして大事に控えておきましょう。 
あらかじめそのような Apps が作成されている場合には、その App の管理者にトークンをもらいましょう。 


**なお、このトークンの発行者はDMの送信者となります。**

### 3. emails.csvとdm_template.txtの設定

#### `./emails.csv` はDM送付先の相手のメールアドレスです。

```
aaaa@example.com,teacher_a@example.com,teacher_b@example.com
bbbb@example.com,teacher_a@example.com,teacher_b@example.com
```

トークン作成者以外のメールアドレスを入れてDMを作ります。 
DMの使用上、8名までしか入れられないのでメールアドレスは7つまでとなります。 
DM作成者+メールアドレス7つで、8名がDMの最大値です。 

#### `./dm_template.txt` はDMのテンプレート文章です。

```
{0} さん、 {1} さん、すみません。 <#WV1KJQFK8> です。
ツールのテストでダイレクトメールを遅らせてもらいます:bow: 
ご迷惑おかけします！
```

{0} はメールアドレスの1番目のユーザー、{1} はメールアドレスの2番目のユーザーに置き換わります。 
メンションを飛ばしたい場合には、 `<@WV1KJQFK8> ` のように `<@ユーザーID> `の形式とすることで特定の相手にメンションを入れたテンプレートを作ることができます。


### 4. スクリプトの実行

コンソールにて、OAuth Access Token を指定して実行します。


```
env SLACK_TOKEN="xoxp-99999999-99999999-hogehoge-fugafuga" npm start
```

Windows の PowerShell の場合には、

```
& { $env:SLACK_TOKEN="xoxp-99999999-99999999-hogehoge-fugafuga"; npm start }
```

以上を実行すると

```
[INFO] 全 2 件の処理を開始します。
[INFO] emails: aaaa@example.com,teacher_a@example.com,teacher_b@example.com へのDM送信に成功しました。
[INFO] emails: bbbb@example.com,teacher_a@example.com,teacher_b@example.com へのDM送信に成功しました。
[INFO] 全 2 件の処理を終えました。
```

のように表示され実行されます。エラーが生じた場合にもその結果を表示してくれます。エラーが生じても成功するものは実行されます。


### 5. その他の環境変数オプション

- `EMAILS_FILE` をファイルのパスにすることで異なる `./emails.csv` 以外の E メールを設定している CSV ファイルを指定することができます。
- `DM_TEMPLATE_FILE` をファイルのパスにすることで異なる `./dm_template.txt` 以外の テンプレートを指定することができます。

# LISENCE
ISC LICENSE
