---
layout: default
title: 技術構成（Architecture）
---

# 技術構成（Architecture）

このリポジトリは「基本は静的サイト、必要なところだけ動的API」というシンプルな構成です。

## 全体像

- 表示: GitHub Pages + Jekyll（Markdown を HTML に変換）
- 動的API: Cloudflare Workers + KV（匿名質問ボードの保存・取得）
- フロント: 1 枚の `board.html`（JSでAPIを呼ぶだけの軽量構成）

メリット
- 運用が楽: 静的サイトはビルドと配信だけ。サーバ管理が不要。
- 表示が速い: GitHub Pages と Cloudflare のエッジから配信。
- コストが安い: Cloudflare Workers は無料枠/低コストで始められる。

---

## GitHub Pages + Jekyll（Markdown 中心）

- GitHub Pages は、リポジトリのファイルをそのまま静的サイトとして配信してくれる仕組みです。
- Markdown（`.md`）で文章を書くと、Jekyll が HTML に変換して公開してくれます（このサイトもそうです）。
- 講義スライドのような「見た目作り込み」は純粋な HTML でも良いですが、
  - 文章量が多い教材や手順書は「Markdown で書く → 自動で整った HTML に変換」が圧倒的に楽です。
  - 見出し・箇条書き・コードブロック・リンクなどを簡潔に書け、レビューもしやすく、差分も読みやすいです。

補足
- 本リポジトリでは Jekyll テーマを最小限にし、`*.md` を中心にコンテンツを管理しています。
- 例外的に、匿名質問ボードは動的APIに接続するため `board.html`（素のHTML+JS）を採用しています。

---

## 匿名質問ボード: Cloudflare Workers + KV

### Cloudflare とは

- 世界中に分散したネットワーク（エッジ）からコンテンツやコードを配信するプラットフォームです。
- Developer Platform の一部として **Workers**（サーバレス実行環境）と **KV**（分散KVS）などさまざまなサービスを提供しています。
- 料金は無料枠/低価格から始められ、小規模な学習用・社内用にとても向いています。
  - 参考: https://www.cloudflare.com/ja-jp/developer-platform/products/workers/

### Workers（サーバレス実行環境）

- JavaScript/TypeScript で「リクエストを受けたら実行する」コードを書き、世界中のエッジで実行されます。
- サーバのプロビジョニングやスケールを気にせず、`fetch()` ハンドラを書くだけで API を公開できます。
- 環境変数やシークレット、KV/Durable Objects などを「バインディング」で利用可能。

### KV（Key-Value Storage）

- 文字通り「キーと値」を保存する分散ストア。低レイテンシで読み取れるのが強みです。
- 注意点は「結果整合（eventual consistency）」であること。
  - 書き込み直後、別リージョンの `list` に反映されるまで数秒〜十数秒遅れることがあります。
  - 本リポジトリでは、体感を良くするためにフロント側で楽観的UI（投稿直後に即リストに反映）を入れています。

### このボードのAPI設計

- エンドポイント
  - `POST /api/messages` で質問を保存（JSON `{ text }` を受け取り、`{ id, ts, text }` を返す）
  - `GET /api/messages?limit&cursor` で新しい順に一覧を取得
  - `DELETE /api/messages/:id` は管理用（Bearer Token）
- 低負荷・シンプル設計
  - データはKVにそのままJSONで保存。
  - 読み取りは定期ポーリング（既定5秒）。
  - 簡易レート制限（IPごとに分単位で上限）もKVで実装。
- セキュリティ
  - CORSは許可オリジンのみに限定（GitHub Pages と ローカル開発用のみ）。
  - 管理用削除APIはトークン必須。トークンはWorkersの環境変数で安全に保持。

### リクエストの流れ（概念図）

1. ブラウザ（`board.html`）が `fetch('/api/messages')` を実行
2. Cloudflare Workers がリクエストを受け、KV からデータを読み込み
3. JSON を返す（CORS ヘッダ付与）
4. フロントはJSONを描画。投稿時はレスポンスを使って即時反映

---

## まとめ

- 「コンテンツは Markdown（Jekyll）で、動的な最小限だけ Workers + KV」で、学習用途にちょうど良い構成です。
- 小さく始めて、必要に応じて Durable Objects や D1（SQL）などへ拡張できます。

