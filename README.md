# AIを活用して自分のWebサイトを構築する講習会

## はじめに

### 目的

- AI開発ツールであるGemini-CLIを用いて、GitHub Pages上にサイトを構築する方法を学び、実際に公開する

### 得られるもの

- Gemini-CLIの使い方（環境構築、上手な使い方、気をつけるべき点）
- Git, GitHubの簡単な使い方
- HTML, CSS, Java Scriptを使ったWebサイト作成の方法

### 得られないもの

- HTML, CSS, Java Scriptの詳細な文法


## Git, GitHubとは


### Git
- **バージョン管理システム**の一つ
- ファイルの変更履歴を記録し、過去の状態に戻したり、変更内容を確認できる
- 例：文書、プログラムを書いていて「3日前の版に戻したい」というときに便利

### GitHub
- Gitを使ったプロジェクトを**インターネット上で管理・共有**できるサービス
- 世界中の開発者が利用している最大級のプラットフォーム
- 無料でWebサイトを公開できる「GitHub Pages」機能がある

### なぜ使うのか？
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

確かにその通りですね！Gemini-CLIを使うならコマンドライン環境は避けられないので、一緒にGitコマンドも覚えてもらった方が一貫性があります。

## Gitの準備とSSH設定

### Gitのインストール
- Windows: [Git for Windows](https://gitforwindows.org/)をダウンロード
- Mac: ターミナルで `git --version`（入ってなければ自動でインストール案内）

### SSHキーの作成
```bash
# メールアドレスは自分のものに変更
ssh-keygen -t ed25519 -C "your-email@example.com"
```
- Enterを3回押す（パスフレーズは設定しなくてOK）
- `~/.ssh/id_ed25519.pub` にキーが生成される

### GitHubにSSHキーを登録
1. 公開鍵の内容をコピー
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. GitHub → Settings → SSH and GPG keys
3. 「New SSH key」をクリック
4. Title: 適当な名前（例：My Laptop）
5. Key: コピーした内容を貼り付け
6. 「Add SSH key」

### 接続テスト
```bash
ssh -T git@github.com
```
- 「Hi [ユーザー名]!」と表示されれば成功

### Gitの初期設定
```bash
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
```

