# AIを活用して自分のWebサイトを構築する講習会

## はじめに

### 目的

- AI開発ツールであるGemini-CLIを用いて、GitHub Pages上にサイトを構築する方法を学び、実際に公開する

### 得られるもの

- Gemini-CLIの使い方（環境構築、上手な使い方、気をつけるべき点）
- ターミナル上でのGitの操作、GitHubの使い方
- HTML, CSS, Java Scriptを使ったWebサイト作成の方法

### 得られないもの

- HTML, CSS, Java Scriptの詳細な文法


## Gemini-CLI
![Gemini-CLI](./images/gemini-cli.png)
- Googleが提供するオープンソースのAIエージェント
- ターミナル上でGeminiモデルを利用してコード生成・修正、文章作成など、複数の業務を自然言語で操作可能

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

#### **公開鍵をコピー**

```bash
cat ~/.ssh/id_ed25519.pub
```

（WindowsのGit Bashでも同じコマンドでOK）

#### **GitHubに登録**

1. GitHub → 右上プロフィール → **Settings**
2. 左メニューの「**SSH and GPG keys**」をクリック
3. **New SSH key** を押す
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
<details>
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

## GitHubでリポジトリを作成しローカルにクローン


### 1. GitHubで新しいリポジトリを作成

1. GitHubにログイン
2. 右上の「＋」→ **New repository** をクリック ![GitHub-New](./images/github-new.png)
3. **Repository name**：任意の名前を入力（例：`my-website`）
4. 他の設定はデフォルトのままでOK（**README**は作成しなくてOK. Choose VisibilityもPublicのまま）
5. **Create repository** をクリック


### 2. ターミナルでローカルにリポジトリを作成する

1. ターミナル上でコマンドを打ってリポジトリを作成する
```bash
mkdir my-site # my-siteという名前のディレクトリを作成
cd my-site # my-siteのディレクトリに移動
git init # そのディレクトリをGit管理する初期化コマンド
```

<details>
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