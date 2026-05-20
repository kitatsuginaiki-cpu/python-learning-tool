# CLAUDE.md — PyLadder

Claude Code が毎回読み込むプロジェクト設定。

## 1. プロジェクト概要

研究（重力マイクロレンズのデータ解析）用の Python 自習ツール。ブラウザ内で本物の
Python が動く静的 HTML（Pyodide）。インストール・サーバ・利用料ゼロ。詳細は `docs/`。

## 2. ディレクトリ構成

```
python学習ツール/
├── index.html              エントリ（単一HTML、ビューを切り替える）
├── src/
│   ├── main.js             起動・ビュー切替
│   ├── pyodide-runner.js   Pyodide ロード／コード実行／採点（Pyodide はここに集約）
│   ├── editor.js           コードエディタ部品（CodeMirror。差し替え可能に隔離）
│   ├── progress.js         localStorage 進捗（localStorage アクセスはここだけ）
│   ├── markdown.js         解説の Markdown 描画
│   └── views/              画面 S1〜S4（SCREENS.md 参照）
│       ├── loading.js / home.js / lesson.js / capstone.js
├── content/
│   ├── stage-1.js          段1 numpy のコンテンツ（MVP）
│   ├── error-guide.js      エラー読解ガイド（段横断・共通）
│   └── （stage-0.js, stage-2.js … は MVP 後に追加）
├── styles/main.css
├── docs/                   PRD / LESSON_DESIGN / TECH_STACK / SCREENS / DATA_MODEL
├── Python学習ツール_構想メモ.md
└── CLAUDE.md / .gitignore
```

## 3. よく使うコマンド

- ローカル起動: `python -m http.server 8000` → `http://localhost:8000`
  （`file://` 直開きは Pyodide が動かない。必ず HTTP 経由）
- ビルド: **なし**（ビルド工程ゼロが設計方針）
- テスト: 自動テストは持たない。動作確認は `/verify`、または各演習の `test`（assert）が
  事実上の自己テスト

## 4. コーディング規約

- 言語: 素の JavaScript（ES Modules）。**TypeScript は使わない**。型ヒントは JSDoc。
- 命名: ファイルは kebab-case、変数・関数は camelCase、定数は UPPER_SNAKE。
  コンテンツの `id` は DATA_MODEL.md の ID 規約（`stage-N-lesson-M-ex-K`）に従う。
- モジュール: 1ファイル1責務。view は描画関数を `export` する。
- Pyodide 呼び出しは `pyodide-runner.js` に集約。view から直接 Pyodide を触らない。
- コードエディタは `editor.js` に隔離（CodeMirror ↔ textarea を差し替え可能に保つ）。
- localStorage アクセスは `progress.js` のみ。
- DOM 操作は素の DOM API。フレームワークは使わない。

## 5. 使ってはいけないライブラリ・パターン

- React / Vue 等の UI フレームワーク、バンドラ（Vite / webpack）、TypeScript（MVP 時点）。
- npm 依存を増やさない。外部ライブラリは CDN（ESM）から読む。
- バックエンド呼び出し・有料 API（PRD スコープ外）。
- localStorage に大きいデータ（`.phot.txt` の中身など）を保存しない。
- 学習者コードを画面に出すとき、未サニタイズの `innerHTML` を使わない。

## 6. 環境変数

**なし。** 静的サイトでサーバも API キーも無い。`.env` を作らない。

## 7. Claude Code への指示

- `docs/` の5文書（PRD / LESSON_DESIGN / TECH_STACK / SCREENS / DATA_MODEL）が仕様の
  正。実装はこれに従い、食い違いに気づいたら先に文書を直す。
- **MVP スコープは「エンジン＋段1 numpy」**。段0・段2〜8 には手を出さない。
- 各演習は1セル完結。Pyodide 実行は演習ごとに名前空間を分離する（NameError 構造排除）。
- `____` が残った `starterCode` をそのまま実行したら、SyntaxError ではなく
  「空欄が残っています」と親切に知らせる。
- パッケージは段ごとに遅延ロード。段1 は numpy のみ読み込む。
- 「環境で詰まらないこと」が最優先。実装も「インストール不要・ビルド不要」を崩さない。
- 変更後は `python -m http.server` で起動確認、または `/verify` で動作確認する。
