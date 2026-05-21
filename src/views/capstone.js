// S4 卒業課題画面。段の総仕上げ課題を行う。
// 演習カード自体は lesson.js の renderExercise を再利用する。
// 課題が実データを使う場合（ex.needsDataFile）はファイルのドラッグ＆ドロップを
// 用意し、Pyodide 仮想FSへ書き込む。使わない場合はそのまま解く。

import { renderExercise } from "./lesson.js";
import { renderMarkdown } from "../markdown.js";
import { writeDataFile, ensurePackages } from "../pyodide-runner.js";
import { loadProgress, markCleared } from "../progress.js";

/** ドロップしたファイルを置く Pyodide 仮想FS上のパス。starterCode/test と合わせる。 */
const DATA_PATH = "/data.phot.txt";

const INTRO_FILE =
  "段の総仕上げです。あなた自身の測光ファイル（`.phot.txt`）を読み込み、" +
  "この段で学んだことを使って課題に挑戦します。\n\n" +
  "下の枠に `.phot.txt` をドロップ（またはクリックして選択）してください。" +
  "**4列**（時刻・フラックス・誤差・名前）のテキスト形式を想定しています。" +
  "`#` で始まる行はコメントとして読み飛ばされます。";

const INTRO_PLAIN =
  "段の総仕上げです。この段のレッスンで学んだことを全部使って、" +
  "仕上げの課題に挑戦しましょう。";

/** HTML 特殊文字をエスケープする。 */
function escapeText(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 卒業課題画面を描画する。
 * @param {HTMLElement} container
 * @param {{ stage: object, onBackHome: () => void }} ctx
 */
export function renderCapstone(container, { stage, onBackHome }) {
  const progress = loadProgress();
  const ex = stage.capstone;
  const needsFile = !!ex.needsDataFile;

  // この段で必要な追加パッケージ（pandas 等）を先読みしておく。
  ensurePackages(stage.packages || []);

  const dropzoneHtml = needsFile
    ? `<div class="dropzone" tabindex="0">
         <p class="dz-msg">ここに <code>.phot.txt</code> をドラッグ＆ドロップ<br>
           （またはクリックして選択）</p>
         <input type="file" class="dz-input" accept=".txt,.phot,.dat" hidden />
       </div>`
    : "";

  container.innerHTML = `
    <div class="lesson">
      <div class="lesson-head">
        <button class="link back">← ホーム</button>
        <span class="crumb">${escapeText(stage.title)} ・ 卒業課題</span>
      </div>
      <h2>卒業課題 — ${needsFile ? "実データで仕上げる" : "段のまとめ"}</h2>
      <div class="explanation">${renderMarkdown(
        needsFile ? INTRO_FILE : INTRO_PLAIN
      )}</div>
      ${dropzoneHtml}
      <div class="exercise-slot"></div>
    </div>`;

  container.querySelector(".back").addEventListener("click", onBackHome);

  const card = renderExercise(ex, {
    index: 0,
    total: 1,
    hasNextLesson: false,
    hasCapstone: false,
    packages: stage.packages || [],
    onPass: () => markCleared(progress, ex.id),
    onAdvance: onBackHome,
  });
  const runBtn = card.querySelector(".run");
  container.querySelector(".exercise-slot").appendChild(card);

  if (!needsFile) return; // ファイル不要ならここまで

  // --- 以下、実データを使う課題のみ: ドロップゾーンの配線 ---
  // ファイル投入まで「実行して採点」は押せない。
  runBtn.disabled = true;

  const dz = container.querySelector(".dropzone");
  const input = container.querySelector(".dz-input");
  const msg = container.querySelector(".dz-msg");

  /** ファイルを受け取り、Pyodide 仮想FSへ書き込む。 */
  async function acceptFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      await writeDataFile(DATA_PATH, text);
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "").length;
      msg.innerHTML =
        `読み込み済み: <strong>${escapeText(file.name)}</strong>` +
        `<br>（${lines} 行）`;
      dz.classList.add("loaded");
      runBtn.disabled = false;
    } catch (e) {
      msg.textContent = "ファイルの読み込みに失敗しました: " + e;
    }
  }

  dz.addEventListener("click", () => input.click());
  dz.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      input.click();
    }
  });
  input.addEventListener("change", () => acceptFile(input.files[0]));
  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("over");
  });
  dz.addEventListener("dragleave", () => dz.classList.remove("over"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("over");
    acceptFile(e.dataTransfer.files[0]);
  });
}
