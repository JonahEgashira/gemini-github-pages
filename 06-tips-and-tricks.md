---
layout: default
title: Tips・検索・画像添付
---

# Gemini CLI Tips

Gemini CLIは複数の機能を実行できるAIエージェントなので、Webサイトを構築する以外にも、数多くのことができます。詳細は[公式GitHub](https://github.com/google-gemini/gemini-cli)をご覧ください。ここでは便利な機能をいくつか紹介します。

## Web検索

Geminiは強力なGoogle検索を利用してインターネット上の情報にアクセスし、ユーザーのリクエストをサポートできます。

```bash
user>直近1週間のappleの株価を検索して、推移を新しいHTMLファイルに載せておいて。 
```

![Apple](./images/apple.png)

## ファイル（画像）添付

Gemini CLIに画像を含めたファイルを読み込ませて、そのファイルの内容を解析してもらったり、参考にする画像をもとにWebページのデザインを行うこともできます。

画像を添付するには、Gemini CLIの入力エリアに`@ファイルへのパス`を入力します。

パス（path）とは、コンピューター上でファイルやフォルダがどこにあるかを示す「住所」のようなものです。

ここではAppleのWebページのスクリーンショットを撮り、その画像をGemini CLIに渡して再現してみます。

<details>
<summary>💡 パス（path）を理解しよう</summary>

> **パス = ファイルやフォルダまでの"道順"**
> パソコンの中で目的地を示す住所のようなものです。

- 絶対パスと相対パス

| 種類       | いつ使う？                           | 例（macOS/Linux）                                   | 例（Windows）                                         |
| -------- | ------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **絶対パス** | ファイルの場所を"地球規模"で一意に示したいとき        | `/Users/jonah/projects/my-site/images/apple-hp.png` | `C:\\Users\\jonah\\projects\\my-site\\images\\apple-hp.png` |
| **相対パス** | 今いるフォルダ（カレントディレクトリ）からの距離で示したいとき | `./images/apple-hp.png`                             | `.\\images\\apple-hp.png`                             |

* `./` は "今いる場所"
* `../` は "ひとつ上の階層"

</details>

---

Appleのページのスクリーンショットを撮り、`apple-hp.png`などの名前でcodespaceのファイルエクスプローラエリアに追加します。

![Github Apple](./images/github-apple-hp.png)

Geminiに、`@`と入力すると、添付するファイルの候補が出てくるので、`@apple-hp.png`を選択します。その状態で、この画像に対して行いたいリクエストを入力します。

```bash
user> @apple-hp.png このappleのhpの画像を参考にして、appleっぽいHTMLページを新しく作ってください。
```

![Gemini Apple Request](./images/gemini-apple-request.png)

すると、画像を読み込んだGemini CLIがAppleのページに近いデザインを作成してくれます。iPhoneの画像などは準備していないので表示していませんが、ボタンやヘッダーの見た目はかなり近いのではないでしょうか。

![Gemini Apple](./images/gemini-apple.png)

---

## そのほかのコマンド

Gemini CLI には `/compress` などの便利なコマンドもあります。（本ドキュメントでは割愛）

