# 技術スタック決定書（PyLadder）

> spec フロー STEP2 相当。PRD・LESSON_DESIGN を前提に技術選定する。
> 前提: 開発者は大学院生（個人）、フロントエンドは初心者、Claude Code で開発、
> 予算ゼロ。PRD のとおりバックエンド・サーバ・有料 API は使わない。
> 作成: 2026-05-21

---

## 0. 方針

このプロジェクトは「静的 HTML＋Pyodide」で、サーバもDBも持たない。
よって**選定の軸は「シンプルさ」と「ビルド工程をなくすこと」**。
フロントエンド初心者が Claude Code と保守できる最小構成を選ぶ。

---

## 1. 言語・基盤 — HTML5 + CSS + JavaScript（ES Modules）、ビルドなし

- **採用理由**: 静的サイトなのでブラウザがそのまま実行できる。ES Modules（`import`/
  `export`）は全モダンブラウザがネイティブ対応 → バンドラ不要。ビルド工程ゼロは
  「環境で詰まらない」という本プロジェクトの思想とも一致。
- **代替案と比較**:
  - *React + Vite*: コンポーネント管理は楽だが、ビルド・node_modules・初心者には学習コスト。UI が単純な本ツールには過剰。
  - *TypeScript*: 型安全は魅力だがビルド工程が増える。→ MVP は素の JS ＋ JSDoc コメントで型ヒントを補う。UI が育ったら TS 化を検討。
- **無料枠・課金**: 言語自体は無償。課金は一切なし。
- **Claude Code 相性**: ◎ 単一の HTML/CSS/JS をそのまま編集・確認でき、ビルド失敗の
  デバッグが不要。

## 2. Python 実行 — Pyodide（CDN 配信・版数固定）

- **採用理由**: PRD の中核。ブラウザ内で numpy/scipy/pandas/matplotlib が動く。
  jsDelivr の CDN から読み込み、**版数を固定**して挙動を安定させる。
- **代替案と比較**:
  - *サーバ側 Python 実行*: バックエンド・サーバ代が発生。PRD のスコープ外。
  - *Skulpt 等の軽量 Python*: numpy/scipy が無い → 研究用途では不可。
- **無料枠・課金**: Pyodide 本体・CDN とも無償。課金なし。
- **Claude Code 相性**: ○ JS から `loadPyodide()` を呼ぶだけ。
- **段ごとの遅延ロード**: パッケージは段で必要になった時に読み込む。MVP（段1 numpy）は
  Pyodide コア＋numpy のみ → 初回ロードを大幅に軽量化。scipy/pandas/matplotlib は
  段2以降で `loadPackage`、emcee は段6で `micropip.install("emcee")`。
- **注意（PRD リスク）**: 初回ロードが重い → プログレス表示必須。`file://` 不可 →
  ローカルは `python -m http.server` 経由。

## 3. コードエディタ部品 — CodeMirror 6（Python 言語パック）

- **採用理由**: 穴埋め演習の入力欄。Python のシンタックスハイライト・インデント補助が
  あり学習体験が良い。CodeMirror 6 は軽量・ESM 配信で対応。
- **代替案と比較**:
  - *素の `<textarea>`*: 依存ゼロで最も簡単。ハイライトなし。**MVP の妥協案として可**
    （まず textarea で作り、後から CodeMirror へ差し替えても影響は局所）。
  - *Monaco Editor*: 高機能だが重く、本ツールには過剰。
- **無料枠・課金**: OSS、無償。
- **Claude Code 相性**: ○。差し替えが局所で済むよう、エディタは1つの部品に隔離する。

## 4. グラフ描画 — matplotlib（Agg バックエンド → PNG 表示）

- **採用理由**: matplotlib で `Agg` バックエンドを使い、図を PNG（base64）として
  `<img>` に表示する。挙動が予測でき実装が単純。
- **代替案と比較**:
  - *matplotlib-pyodide のインタラクティブ backend*: 操作可能だが複雑。学習用途では
    静的 PNG で十分。
- **無料枠・課金**: なし（matplotlib は Pyodide 同梱）。
- **Claude Code 相性**: ○。

## 5. コンテンツ保持形式 — 段ごとの JS モジュール（`content/stage-N.js`）

- **採用理由**: LESSON_DESIGN のスキーマを格納する形式。レッスンには `starterCode`・
  `test` など**複数行の Python コード文字列**が入る。JS のテンプレートリテラル
  （`` ` ``）なら改行をそのまま書けて執筆が楽。JSON は改行を `\n` エスケープする
  必要があり、コンテンツ・プロジェクトには不向き。段ごとに1ファイルへ分割し、
  追加・保守をしやすくする。
- **代替案と比較**:
  - *JSON*: パースは楽だが複数行コードの執筆が苦痛。不採用。
  - *Markdown ＋ 独自パーサ*: 執筆は楽だがパーサ実装コストが増える。将来検討。
- **無料枠・課金**: なし。
- **Claude Code 相性**: ◎ レッスン追加が「ファイル1枚追加」で済む。

## 6. 状態保存 — localStorage（ライブラリなし）

- **採用理由**: 進捗（クリア済み演習）はブラウザの localStorage に素の API で保存。
  軽量で外部送信なし（PRD プライバシー要件）。
- **代替案**: IndexedDB はオーバースペック。不採用。
- **無料枠・課金**: なし。

## 7. ホスティング／デプロイ — Cloudflare Pages（推奨）または GitHub Pages

- **採用理由**: PRD のとおり静的ホスティング。`https://` 必須。
  GitHub Pages は無料だと公開リポジトリ前提のため、**ソース非公開を望むなら
  Cloudflare Pages**（private ソースでも無料で静的公開可）。公開で構わなければ
  GitHub Pages でもよい。MVP が手元で動いてからデプロイ設定する。
- **無料枠・課金**: いずれも個人利用は無料枠で収まる。課金なし。
- **Claude Code 相性**: ○。

## 8. ローカル開発・動作確認

- **ローカルプレビュー**: `python -m http.server 8000`（標準ライブラリのみ）。
- **動作確認**: 各演習の `test`（assert）が事実上の自己テスト。開発時は Claude Code の
  `/verify` で「ブラウザで実際に解けるか」を確認。自動 E2E（Playwright 等）は
  必要になった段階で検討。

---

## 9. 推奨する最終スタック構成

| 区分 | 採用技術 |
|---|---|
| 言語・基盤 | HTML5 + CSS + JavaScript（ES Modules、ビルドなし） |
| Python 実行 | Pyodide（jsDelivr CDN、版数固定） |
| コードエディタ | CodeMirror 6（Python パック）／MVP 妥協案は `<textarea>` |
| グラフ描画 | matplotlib Agg → PNG（base64）→ `<img>` |
| コンテンツ保持 | 段ごとの JS モジュール `content/stage-N.js` |
| 状態保存 | localStorage（素の API） |
| ホスティング | Cloudflare Pages（推奨）／GitHub Pages |
| ローカル開発 | `python -m http.server` |
| 動作確認 | 演習の `test` ＝自己テスト ＋ Claude Code `/verify` |
| 月額コスト | **0 円**（API・サーバ・有料サービスなし） |

## 10. 次工程への申し送り

- **STEP3（画面設計）**: 段一覧／レッスン画面（3層UI）／卒業課題画面、Pyodide ロード
  画面を設計。
- **STEP4（データモデル）**: LESSON_DESIGN のスキーマを JS モジュールの型として確定し、
  localStorage の進捗データ構造を定義。
