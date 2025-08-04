# Gemini CLIでWebサイトをつくろう

## はじめに

### 目的

- AI開発ツールであるGemini CLIを用いて、GitHub Pages上にサイトを構築する方法を学び、実際に公開する

### 得られるもの

- AIエージェントであるGeminiCLIの使い方（環境構築、上手な使い方、気をつけるべき点）
- ターミナル上でのGitの基礎の操作、GitHubの使い方
- VSCodeなどのコードエディタの簡単な使い方
- HTML, CSS, Java Scriptを使ったWebサイト作成の方法

### 得られないもの

- HTML, CSS, Java Scriptの詳細な文法
- Geminiなどの言語モデル自体の理論

## GeminiCLI
![Gemini CLI](./images/gemini-cli.png)
- Googleが提供するオープンソースのAIエージェント
- ターミナル上でGeminiモデルを利用してコード生成・修正、文章作成など、複数の業務を自然言語で操作可能
- Webサイト上で使用するGeminiと違って、Gemini CLIはエージェントとして自身のPC上で色々な操作をしてくれるが、最低限ターミナル上での操作を覚える必要がある。

# 環境構築（GitHub, Gemini CLI）

## Git, GitHub

### Git
- **バージョン管理システム**の一つ
- ファイルの変更履歴を記録し、過去の状態に戻したり、変更内容を確認できる
- 例：文書、プログラムを書いていて「3日前の版に戻したい」というときに便利

### GitHub
- Gitを使ったプロジェクトを**インターネット上で管理・共有**できるサービス
- 世界中の開発者が利用している最大級のプラットフォーム
- 無料でWebサイトを公開できる「GitHub Pages」機能がある

### Git, GitHubが使われる理由
1. **失敗しても安心** - いつでも前の状態に戻せる
2. **共同作業が簡単** - 複数人で同じプロジェクトを編集できる
3. **無料でWebサイト公開** - GitHub Pagesで自分のサイトを世界に公開

### 基本的な流れ
1. GitHubでリポジトリ（プロジェクトの保管場所）を作成
2. 自分のパソコンで編集
3. 変更をGitで記録
4. GitHubにアップロード
5. GitHub Pagesで公開

## GitHubアカウント作成

- ブラウザで [https://github.com](https://github.com) を開く
- 右上の「Sign up」ボタンをクリック
- 必要な情報を入れる

![GitHub](./images//github.png)

## Gitの準備とローカル操作（Mac / Windows）

### 1. ターミナルを開く

#### **Windowsの場合**

* **おすすめ**：Gitをインストールすると一緒に入る **Git Bash** を使うと便利です
  （黒い画面にLinux風のコマンドが使える）

1. [Git for Windows](https://gitforwindows.org/) をダウンロードしてインストール
2. スタートメニューで **「Git Bash」** を検索して起動
   （黒いウィンドウが開きます）
3. ここで以降のコマンドを入力します

※ もしPowerShellやコマンドプロンプトしか使えない場合も同じコマンドが使えますが、Git Bashのほうが初心者にはやさしいです。

---

#### **Macの場合**

* 標準の **「ターミナル」** アプリを使います

1. Finderで「アプリケーション → ユーティリティ → ターミナル」を開く
   または **Spotlight検索（⌘+Space）** で「ターミナル」と入力して起動
2. 黒い（または白い）ウィンドウが開きます
3. ここで以降のコマンドを入力します

---

### 2. Gitが入っているか確認

```bash
git --version
```

* **バージョン番号が表示されればOK**
* Windowsで「command not found」や「認識されません」と出たら、Gitがインストールされていないので、[Git for Windows](https://gitforwindows.org/)をインストールしましょう。
* Macでは入っていない場合、自動で「開発者ツールをインストールしますか？」と聞かれるので「はい」を選びます。

---

### 3. SSHキーを作成してGitHubと接続

#### **SSHキー作成**

```bash
ssh-keygen -t ed25519 -C "あなたのメールアドレス"
```

* **Enter**を3回押す（パスフレーズは空でOK）
* キーは `~/.ssh/id_ed25519.pub` に作られます

### ⚠️注意事項⚠️

- `.pub`がついているファイルは**公開鍵**で、他人に公開しても問題ありません。
- `.pub`がついていないファイルは**秘密鍵**で、絶対に他人に教えたり、Webサイト上に貼り付けたりしてはいけません。

この点に注意して、SSHキーを安全に管理してください。


#### **公開鍵をコピー**

```bash
cat ~/.ssh/id_ed25519.pub
```

（WindowsのGit Bashでも同じコマンドでOK）

#### **GitHubに登録**

1. GitHub → 右上プロフィール → **Settings**
2. 左メニューの「**SSH and GPG keys**」をクリック
3. **New SSH key** を押す
![GitHub SSH](./images/github-ssh.png)
4. **Title**：わかりやすい名前（例：My Laptop）
5. **Key**：コピーした公開鍵を貼り付け
6. **Add SSH key** を押す

---

### 4. 接続テスト

```bash
ssh -T git@github.com
```

* 「Hi \[ユーザー名]!」と出ればOK

---

### 5. Gitのユーザー情報を設定

```bash
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```
<details markdown="1">
<summary>補足：💡SSHキーとは何か</summary>

* **SSH**（Secure Shell）は、インターネット越しに安全にサーバーとやりとりするための仕組みです
* **SSHキー**は「合鍵ペア」のようなもので、

  * **秘密鍵** → あなたのPCに保管（絶対外に出さない）
  * **公開鍵** → GitHubに登録してOK
* GitHubは「この公開鍵と合う秘密鍵を持っている人だけを信頼する」しくみ
* これにより、**毎回パスワードを入力せずに、安全に接続できる**ようになります

> **例えるなら…**
> 郵便受けに自分専用の鍵穴を付けて、鍵を持っているのはあなただけ。
> 郵便屋さん（GitHub）はその鍵でしか開かないようにしてくれる…そんなイメージです。
</details>

## GitHubでリポジトリを作成


### 1. GitHubで新しいリポジトリを作成

1. GitHubにログイン
2. 右上の「＋」→ **New repository** をクリック ![GitHub-New](./images/github-new.png)
3. **Repository name**：任意の名前を入力（例：`my-website`）
4. 他の設定はデフォルトのままでOK（**README**は作成しなくてOK. Choose VisibilityもPublicのまま）
5. **Create repository** をクリック

作成が完了したら以下のような画面になる。一旦ページはこのままにしておいて、次のステップに進む。

![GitHub Setup](./images/github-setup.png)

### 2.ローカルにリポジトリを作成し、GitHubのリポジトリと紐づける

1. ターミナル上でコマンドを打ってリポジトリを作成する
```bash
mkdir my-site # my-siteという名前のディレクトリを作成
cd my-site # my-siteのディレクトリに移動
echo "# my-site" >> README.md # READMD.mdというファイルを作成し、"my-site"という行を入れる
git init # そのディレクトリをGit管理する初期化コマンド
git add README.md # READMD.mdをGit管理する
git commit -m "first commit" # Git管理に追加した変更をコミットする（記録をつける）
git remote add origin git@github.com:<"あなたのアカウント名">/my-site.git # GitHub上のリポジトリに紐づける
git push -u origin main # GitHub上のリポジトリに、ローカルでの変更を適用する
```

- ここまでできたら、先ほど作成したGitHubのリポジトリのページを更新して確認してみてください。`README.md`というファイルが追加されているはずです。　

<details markdown="1">
<summary>補足：💡フォルダ、ディレクトリ、リポジトリの違い</summary>

### **📦 フォルダ**

* パソコンの中でファイルを入れる「入れ物」
* Windowsなら「フォルダー」、Macなら「フォルダ」
* 物理的なディレクトリ構造の見た目のこと

---

### **📂 ディレクトリ**

* フォルダとほぼ同じ意味ですが、**コンピュータ用語寄り**
* ターミナルやコマンドラインで「今いる場所」を指すときに「ディレクトリ」と言う
* 例：`cd my-website` は「my-website というディレクトリに移動」

---

### **📁 リポジトリ（Repository）**

* Gitで管理されているフォルダ（＋その中の履歴データ）
* 普通のフォルダとの違いは「中に `.git` という隠しフォルダがあり、過去の履歴や設定が入っている」こと
* GitHubにアップすると、そのままインターネット上のリポジトリにもなる

</details>


## Gemini CLI のインストール

## Node.jsのインストール

Gemini CLIをインストールするために、`Node.js`という実行環境が必要になります。
`Node.js`はJavaScriptをパソコン、サーバー上で実行するための環境で、Gemini CLIなどのツールをインストールする際も使用されます。

### **Windows**

1. **公式サイトへアクセス**
   [https://nodejs.org/](https://nodejs.org/)

2. **推奨版（LTS）をダウンロード**
   緑色の **"LTS"** ボタンをクリック。

3. **インストーラーを実行**

   * すべて「Next」でOK（特別な設定不要）
   * **"Add to PATH"** にチェックが入っていることを確認。

4. **インストール確認**
   コマンドプロンプト（または PowerShell）で

   ```bash
   node -v
   ```

   バージョンが表示されればOK。

---

### **Mac**

#### 方法1: 公式インストーラー（初心者向け）

1. **公式サイトへアクセス**
   [https://nodejs.org/](https://nodejs.org/)

2. **推奨版（LTS）をダウンロード**（macOS Installer）

3. **インストーラーを実行** → すべてデフォルトでOK。

4. **確認**（ターミナル）

   ```bash
   node -v
   ```

---

#### 方法2: Homebrew（Macに慣れてる方向け）

1. **Homebrewインストール済み**か確認（なければ[公式](https://brew.sh/)）
2. ターミナルで

   ```bash
   brew install node
   ```
3. 確認

   ```bash
   node -v
   ```

<details markdown="1">
<summary>補足：💡JavaScriptとNode.jsの関係</summary>

### 1. JavaScriptとは？
- **プログラミング言語**のひとつ
- 本来は**ブラウザの中で動く**ために作られた
- Webページに動きをつける、フォームの入力チェック、アニメーションなどで活躍

---

### 2. Node.jsとは？
- **JavaScriptをブラウザの外で動かせるソフトウェア（ランタイム環境）**
- Google Chromeの「V8 JavaScriptエンジン」を利用
- サーバーやパソコン上でJavaScriptを直接実行できる

---

### 3. 関係を一言でいうと
> **JavaScript**：言語そのもの  
> **Node.js**：その言語をパソコンやサーバーで動かすための実行環境

---

</details>

## Gemini CLIのインストール

以下のコマンドを実行してインストール
```bash
npm install -g @google/gemini-cli
```

<details markdown="1">
<summary>補足：💡npmとは？</summary>

### npmとは？
- **Node Package Manager**の略
- Node.jsのための**パッケージ管理ツール**
- JavaScriptのライブラリやツールを簡単にインストール、管理、共有できる
- コマンドラインから利用可能で、`npm install`コマンドでパッケージをインストール

</details>


## Gemini CLIの実行

ここまでお疲れ様でした。ターミナル上で`gemini`と入力して、Gemini CLIを起動しましょう
```bash
gemini
```

このような画面が出たら成功です。


![Gemini CLI](./images/gemini-cli.png)


# Gemini CLIを使ってWebサイトを作成する

## シンプルなHTMLファイルの作成　

- Gemini CLIのインストールが完了したら、実際にWebサイトを作っていきましょう。
- ターミナル上で先ほど作成したリポジトリにいることを確認、もしくは移動してください。
```bash
pwd # 先ほど作成したmy-siteが表示されたらOK
```

### Geminiに依頼する

以降、Gemini CLIを起動して、Gemini CLI上で入力する内容は、`user>`を先頭に書く以下ような書き方をすることとし、Geminiからの返答は`gemini>`を先頭に書くこととします
```bash
user> ここにGeminiへのメッセージ、プロンプトが入ります。
gemini> Geminiからの返答はこのように書きます。
```


では、早速GeminiにHTMLファイルを作ってもらいましょう。
```bash
user> このリポジトリは、GitHub Pagesで公開する自分のWebサイトです。シンプルなHTMLを作成してください。
```

すると、私の場合は以下のように返ってきたので、内容についてのメッセージを追加します。
```bash
gemini> はい、承知いたしました。シンプルな index.html を作成します。どのような内容がよろしいですか？特にご希望がなければ、基本的な「こんにちは」というメッセージを入れたものを作成します。
user> タイトルは「Jonahのサイト」で、ようこそ！と言うメッセージでお願いします。
```

GeminiがHTMLファイルの内容を作成し、ユーザにファイル作成と変更の許可を求めます。

![Gemini Confirmation](./images/gemini-confirmation.png)
```bash
1. Yes, allow once (今回のみ変更を許可する)
2. Yes, allow always (このセッション内でのHTMLファイルの作成と変更を常に許可する)
3. Modify with external editor (他のエディターでHTMLファイルを手動で変更する)
4. No, suggest changes (esc) (Geminiが提案した変更を却下し、別の変更内容をユーザーが提案する)
```

今回は 1. の`Yes, allow once`を選択しましょう。HTMLファイルが作成されます。

### ⚠️Gemini CLIの許可に関する注意点⚠️

実行するコマンドには十分注意してください。特に、`rm` や `rm -rf` などの削除系コマンドは、誤って重要なファイルを削除してしまう可能性があります。そのため、これらのコマンドに対しては `allow always` を選択しないことを**強くおすすめ**します。慎重に操作を行い、必要に応じて `allow once` を選択するようにしましょう。


### VSCodeのインストールとコードの確認

コードの生成はGemini CLIがやってくれますが、手動で変更したい部分もあるはずです。そこで、コードエディターであるVSCodeをインストールしてみましょう。

1. **公式サイトへアクセス**
   [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **ダウンロード**
   お使いのOSに合わせたインストーラーをダウンロードしてください。

3. **インストーラーを実行**
   ダウンロードしたインストーラーを実行し、画面の指示に従ってインストールを完了させます。

4. **VSCodeを起動**
   インストールが完了したら、VSCodeを起動します。

5. **リポジトリを開く**
   - メニューから「ファイル」→「フォルダーを開く」を選択します。
   - 先ほど作成したリポジトリのフォルダ（例：`my-site`）を選択し、「フォルダーを選択」をクリックします。
   ![VSCode Open](./images/vscode-open.png)

6. **HTMLファイルの編集**
   リポジトリを開けたら、先ほどGemini CLIが作成したindex.htmlファイルをクリックして開いてみましょう。ここでコードの編集ができます。
   ![VSCode Edit](./images/vscode-edit.png)


- 基本的にはGemini CLIがコードの作成、編集など全ておこなってくれますが、一部分すぐに直したかったり、どんなコードが書かれているかを確認したい時はVSCodeなどのコードエディタをしようするのも便利です。


### 作成したHTMLファイルをブラウザで表示する

HTMLファイルが作られていることが確認できたら、実際にブラウザ上でどんな見た目か確認してみましょう。

![HTML Browser](./images/html-browser.png)

### WindowsでHTMLファイルをブラウザで開く方法

1. **エクスプローラーでファイルを探す**
   - エクスプローラーを開き、作成したHTMLファイル（例：`index.html`）が保存されているフォルダに移動します。

2. **ファイルをダブルクリック**
   - HTMLファイルをダブルクリックすると、デフォルトのブラウザでファイルが開きます。

3. **右クリックメニューから開く**
   - HTMLファイルを右クリックし、「プログラムから開く」→「ブラウザ名」を選択して開くこともできます。

### MacでHTMLファイルをブラウザで開く方法

1. **Finderでファイルを探す**
   - Finderを開き、作成したHTMLファイル（例：`index.html`）が保存されているフォルダに移動します。

2. **ファイルをダブルクリック**
   - HTMLファイルをダブルクリックすると、デフォルトのブラウザでファイルが開きます。

3. **右クリックメニューから開く**
   - HTMLファイルを右クリックし、「このアプリケーションで開く」→「ブラウザ名」を選択して開くこともできます。

### 共通の方法

- **ドラッグ＆ドロップ**
  - HTMLファイルをブラウザのウィンドウにドラッグ＆ドロップすることで、ファイルを開くことができます。

- **ブラウザの「ファイル」メニューから開く**
  - ブラウザを開き、メニューから「ファイル」→「ファイルを開く」を選択し、HTMLファイルを選択して開くことも可能です。

これらの方法で、作成したHTMLファイルを簡単にブラウザで確認することができます。


## 作成したHTMLをGitHub上のリポジトリにPush


### Pushとは

Pushとは、ローカルで行った変更をリモートリポジトリ（GitHubなど）に送信する操作のことです。これにより、他の開発者と変更を共有したり、リモートリポジトリを最新の状態に保つことができます。

### Pushの方法

1. **変更をステージングする**
   - まず、ローカルで行った変更をステージングエリアに追加します。
   ```bash
   git add .
   ```

2. **変更をコミットする**
   - ステージングエリアに追加した変更をコミットします。
   ```bash
   git commit -m "変更内容の説明"
   ```

3. **リモートリポジトリにプッシュする**
   - コミットした変更をリモートリポジトリにプッシュします。
   ```bash
   git push origin main
   ```
   - `main`はプッシュしたいブランチ名です。必要に応じて他のブランチ名に置き換えてください。

これで、ローカルの変更がリモートリポジトリに反映されます。プッシュすることで、他の開発者と変更を共有し、プロジェクトを共同で進めることができます。

## 🤖 Gemini CLIを使ったGitの操作

変更があるたびに、ターミナルに`git add .`とか、`git commit`とかを毎回打つのは面倒です。そこで、そのようなGitの操作も全てGemini CLIにお任せしてみましょう。

```bash
user> いまある変更を全てpushして欲しい。
```

![Gemini Push](./images/gemini-push.png)

すると、Gemini CLIが現在の変更を確認するGitコマンド`git status`を実行し、現状を確認した上で`add`, `commit`, `push`まで行ってくれます。

**⚠️注意⚠️** `git push`等は慎重に行いたいコマンドなので、allow alwaysにせず、allow onceで毎回確認するのがよいでしょう。

### GitHub上でPushできているか確認

Pushが完了したら、GitHub上のリポジトリに正しく追加できているか確認してみましょう。先ほどGitHub上で作成したリポジトリに、index.htmlがあれば成功です。

![GitHub my-site](./images/github-mysite.png)

## GitHub Pagesを使ってデプロイ

### GitHub Pagesとは

GitHub Pagesは、GitHubが提供するサービスで、簡単にWebサイトを作れる場所です。GitHubに保存したHTML、CSS、JavaScriptのファイルを使って、無料でWebサイトを公開できます。例えば、自分の作品を紹介するページや、プロジェクトの説明ページを作るのにとても便利です。

### デプロイとは

デプロイ（Deploy）とは、開発したアプリケーションやWebサイトを実際にユーザーがアクセスできる環境に配置することを指します。GitHub Pagesを使うと、リポジトリにあるコードを簡単にWeb上に公開（デプロイ）することができます。

### GitHub Pagesを使ったデプロイ手順

1. **GitHubリポジトリを準備**
   - デプロイしたいプロジェクトのリポジトリをGitHub上に作成します。（今回は作成済みの`my-site`リポジトリです）

2. **リポジトリにコードをpush**
   - ローカルで作成したHTML、CSS、JavaScriptファイルをリポジトリにpushします。（すでにpush済みです）

3. **GitHub Pagesの設定**
   - リポジトリのページに移動し、右上の「Settings」をクリックします。
   - 左側のメニューから「Pages」を選択します。

4. **公開するブランチを選択**
   - 「Source」セクションで、公開したいブランチ（通常は`main`）を選択します。
   - 「Save」をクリックして設定を保存します。
   ![GitHub Pages main](./images/pages-main.png)

5. **サイトの公開を確認**
   - 設定が完了すると、GitHub PagesのURLが表示されます。このURLをクリックすると、公開されたWebサイトを確認できます。

これで、GitHub Pagesを使ってプロジェクトをデプロイすることができます。公開されたサイトは、GitHubリポジトリの更新に応じて自動的に更新されます。
