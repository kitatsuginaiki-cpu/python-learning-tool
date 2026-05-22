// S3 レッスン画面（3層UI）。解説 → 穴埋め演習（実行・採点・ヒント）。
// 段内のレッスン間ナビゲーションも持つ。

import { createEditor } from "../editor.js";
import { gradeSubmission, ensurePackages } from "../pyodide-runner.js";
import { renderMarkdown } from "../markdown.js";
import { loadProgress, markCleared } from "../progress.js";
import { errorGuide } from "../../content/error-guide.js";

/** HTML 特殊文字をエスケープする。 */
function escapeText(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 標準出力があれば出力ブロックの HTML を返す。 */
function outputBlock(stdout) {
  if (!stdout || !stdout.trim()) return "";
  return `<div class="stdout"><div class="label">出力</div><pre>${escapeText(
    stdout
  )}</pre></div>`;
}

/** matplotlib の図（base64 PNG）があれば図ブロックの HTML を返す。 */
function figureBlock(image) {
  if (!image) return "";
  return `<div class="figure"><div class="label">グラフ</div>` +
    `<img alt="あなたのグラフ" src="data:image/png;base64,${image}"></div>`;
}

/**
 * レッスン画面を描画する。
 * @param {HTMLElement} container
 * @param {{ stage: object, lessonIndex: number,
 *           onBackHome: () => void, onGoLesson: (i: number) => void }} ctx
 */
export function renderLesson(
  container,
  { stage, lessonIndex, onBackHome, onGoLesson, onCapstone }
) {
  const progress = loadProgress();
  const lesson = stage.lessons[lessonIndex];
  const lessonCount = stage.lessons.length;
  const hasPrev = lessonIndex > 0;
  const hasNext = lessonIndex < lessonCount - 1;
  const hasCapstone = !!stage.capstone;
  let exIndex = 0;

  // この段で必要な追加パッケージ（pandas 等）を先読みしておく。
  ensurePackages(stage.packages || []);

  container.innerHTML = `
    <div class="lesson">
      <div class="lesson-head">
        <button class="link back">← ホーム</button>
        <span class="crumb">${escapeText(stage.title)} ・ レッスン ${
    lessonIndex + 1
  } / ${lessonCount}</span>
      </div>
      <h2>${escapeText(lesson.title)}</h2>
      <div class="explanation">${renderMarkdown(lesson.explanation)}</div>
      <div class="exercise-slot"></div>
      <div class="lesson-nav">
        <button class="btn ghost prev"${hasPrev ? "" : " disabled"}>← 前のレッスン</button>
        <button class="btn ghost nextlesson"${hasNext ? "" : " disabled"}>次のレッスン →</button>
      </div>
    </div>`;

  container.querySelector(".back").addEventListener("click", onBackHome);
  if (hasPrev) {
    container
      .querySelector(".prev")
      .addEventListener("click", () => onGoLesson(lessonIndex - 1));
  }
  if (hasNext) {
    container
      .querySelector(".nextlesson")
      .addEventListener("click", () => onGoLesson(lessonIndex + 1));
  }

  const slot = container.querySelector(".exercise-slot");

  function showExercise() {
    const ex = lesson.exercises[exIndex];
    slot.innerHTML = "";
    slot.appendChild(
      renderExercise(ex, {
        index: exIndex,
        total: lesson.exercises.length,
        hasNextLesson: hasNext,
        hasCapstone,
        packages: stage.packages || [],
        onPass: () => markCleared(progress, ex.id),
        onAdvance: () => {
          if (exIndex < lesson.exercises.length - 1) {
            exIndex += 1;
            showExercise();
            slot.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (hasNext) {
            onGoLesson(lessonIndex + 1);
          } else if (hasCapstone && onCapstone) {
            onCapstone();
          } else {
            onBackHome();
          }
        },
      })
    );
  }
  showExercise();
}

/**
 * 1つの演習カードを作る。卒業課題（capstone.js）からも再利用される。
 * `ex.kind === "quiz"` の場合は選択式クイズ（段7・8 の読み物形式）を描く。
 * @param {object} ex 演習
 * @param {{ index: number, total: number, hasNextLesson: boolean,
 *           hasCapstone: boolean, onPass: () => void,
 *           onAdvance: () => void }} ctx
 */
export function renderExercise(ex, ctx) {
  if (ex.kind === "quiz") return renderQuiz(ex, ctx);

  const { index, total, hasNextLesson, hasCapstone, packages = [],
    onPass, onAdvance } = ctx;
  const card = document.createElement("div");
  card.className = "exercise";
  card.innerHTML = `
    <div class="ex-num">演習 ${index + 1} / ${total}</div>
    <div class="prompt">${renderMarkdown(ex.prompt)}</div>
    <div class="editor-slot"></div>
    <div class="ex-actions">
      <button class="btn run">実行して採点</button>
      <button class="btn ghost hint">ヒント</button>
      <button class="btn ghost showsol">答えを見る</button>
    </div>
    <div class="result"></div>
    <div class="hints"></div>
    <div class="next-slot"></div>`;

  const editor = createEditor(ex.starterCode);
  card.querySelector(".editor-slot").appendChild(editor.el);

  const resultEl = card.querySelector(".result");
  const hintsEl = card.querySelector(".hints");
  const nextSlot = card.querySelector(".next-slot");
  const runBtn = card.querySelector(".run");
  let hintsShown = 0;
  let passed = false;

  /** 次のヒントを1つ開示する。 */
  function revealHint() {
    if (hintsShown >= ex.hints.length) return;
    const p = document.createElement("p");
    p.className = "hint-line";
    p.textContent = `ヒント${hintsShown + 1}: ${ex.hints[hintsShown]}`;
    hintsEl.appendChild(p);
    hintsShown += 1;
  }

  card.querySelector(".hint").addEventListener("click", revealHint);

  card.querySelector(".showsol").addEventListener("click", () => {
    editor.setCode(ex.solutionCode);
    resultEl.className = "result";
    resultEl.textContent = "模範解答を表示しました。実行して確認しましょう。";
  });

  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    resultEl.className = "result running";
    resultEl.textContent = "実行中…";
    try {
      const res = await gradeSubmission(editor.getCode(), ex.test, packages);
      renderResult(res);
    } catch (e) {
      resultEl.className = "result error";
      resultEl.textContent = "実行エンジンのエラー: " + e;
    } finally {
      runBtn.disabled = false;
    }
  });

  /** 「次へ」ボタンのラベルを状況に応じて決める。 */
  function advanceLabel() {
    if (index + 1 < total) return "次の演習へ →";
    if (hasNextLesson) return "次のレッスンへ →";
    if (hasCapstone) return "卒業課題へ →";
    return "ホームへ戻る →";
  }

  /** 採点結果を描画する。 */
  function renderResult(res) {
    resultEl.className = "result " + res.status;

    if (res.status === "pass") {
      resultEl.innerHTML =
        "<strong>正解！</strong>" +
        figureBlock(res.image) +
        outputBlock(res.stdout);
      if (!passed) {
        passed = true;
        onPass();
      }
      // 正解したら、先の失敗で出ていたヒントは役目を終えるので消す。
      hintsEl.innerHTML = "";
      if (!nextSlot.querySelector("button")) {
        const b = document.createElement("button");
        b.className = "btn next";
        b.textContent = advanceLabel();
        b.addEventListener("click", onAdvance);
        nextSlot.appendChild(b);
      }
      return;
    }

    if (res.status === "blank") {
      resultEl.innerHTML =
        "<strong>空欄が残っています</strong><br>" +
        "コードの <code>____</code> を埋めてから実行してください。";
      return;
    }

    if (res.status === "fail") {
      resultEl.innerHTML =
        "<strong>もう少し！</strong> 出力や条件を見直しましょう。" +
        (res.detail
          ? `<pre class="detail">${escapeText(res.detail)}</pre>`
          : "") +
        figureBlock(res.image) +
        outputBlock(res.stdout);
      autoHint();
      return;
    }

    // status === "error"
    const guide = errorGuide[res.errorType];
    resultEl.innerHTML =
      `<strong>エラーが出ました（${escapeText(
        res.errorType || "Error"
      )}）</strong>` +
      `<pre class="traceback">${escapeText(res.traceback)}</pre>` +
      (guide ? `<p class="guide">📖 ${escapeText(guide)}</p>` : "") +
      figureBlock(res.image) +
      outputBlock(res.stdout);
    autoHint();
  }

  /** 失敗時、まだヒント未表示なら最初の1つを自動で出す。 */
  function autoHint() {
    if (hintsShown === 0 && ex.hints.length > 0) revealHint();
  }

  return card;
}

/**
 * 選択式クイズのカードを作る（段7・8 の読み物形式で使う）。
 * Pyodide は使わず、選んだ選択肢の番号を `ex.answer` と突き合わせる。
 * @param {object} ex `{ kind:"quiz", prompt, choices:[], answer, explain }`
 * @param {object} ctx renderExercise と同じナビゲーション文脈
 */
function renderQuiz(ex, { index, total, hasNextLesson, hasCapstone, onPass, onAdvance }) {
  const card = document.createElement("div");
  card.className = "exercise quiz";
  card.innerHTML = `
    <div class="ex-num">問題 ${index + 1} / ${total}</div>
    <div class="prompt">${renderMarkdown(ex.prompt)}</div>
    <div class="choices"></div>
    <div class="result"></div>
    <div class="next-slot"></div>`;

  const choicesEl = card.querySelector(".choices");
  const resultEl = card.querySelector(".result");
  const nextSlot = card.querySelector(".next-slot");
  let passed = false;

  /** 「次へ」ボタンのラベルを状況に応じて決める。 */
  function advanceLabel() {
    if (index + 1 < total) return "次の問題へ →";
    if (hasNextLesson) return "次のレッスンへ →";
    if (hasCapstone) return "まとめ問題へ →";
    return "ホームへ戻る →";
  }

  /** 選択肢が選ばれたときの採点。 */
  function pick(i, btn) {
    if (passed) return;
    if (i === ex.answer) {
      passed = true;
      btn.classList.add("correct");
      choicesEl.querySelectorAll(".choice").forEach((c) => (c.disabled = true));
      resultEl.className = "result pass";
      resultEl.innerHTML =
        "<strong>正解！</strong>" +
        (ex.explain
          ? `<div class="explain">${renderMarkdown(ex.explain)}</div>`
          : "");
      onPass();
      const nb = document.createElement("button");
      nb.className = "btn next";
      nb.textContent = advanceLabel();
      nb.addEventListener("click", onAdvance);
      nextSlot.appendChild(nb);
    } else {
      btn.classList.add("wrong");
      btn.disabled = true;
      resultEl.className = "result fail";
      resultEl.innerHTML =
        "<strong>もう少し！</strong> ほかの選択肢を選んでみましょう。";
    }
  }

  ex.choices.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = text; // 学習者向けテキストは textContent で安全に
    b.addEventListener("click", () => pick(i, b));
    choicesEl.appendChild(b);
  });

  return card;
}
