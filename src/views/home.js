// S2 ホーム（ラダー画面）。全9段を縦に並べ、現在地と次の一歩を示す。

import { loadProgress } from "../progress.js";

/** その段に属するクリア済み演習数 / 全演習数を数える。 */
function countProgress(stage, progress) {
  const ids = [];
  for (const lesson of stage.lessons) {
    for (const ex of lesson.exercises) ids.push(ex.id);
  }
  if (stage.capstone) ids.push(stage.capstone.id);
  const done = ids.filter((id) => progress.clearedExercises.includes(id)).length;
  return { done, total: ids.length };
}

/**
 * ホーム画面を描画する。
 * @param {HTMLElement} container
 * @param {{ stages: object[], onSelectStage: (stage: object) => void }} ctx
 */
export function renderHome(container, { stages, onSelectStage }) {
  const progress = loadProgress();

  container.innerHTML = `
    <div class="home">
      <header>
        <h1>PyLadder</h1>
        <p>研究 Python 到達ラダー — 一段ずつ、自分の解析まで</p>
      </header>
      <ol class="ladder"></ol>
    </div>`;

  const ladder = container.querySelector(".ladder");

  for (const stage of stages) {
    const li = document.createElement("li");
    li.className = "stage " + stage.status;

    let badge;
    if (stage.status === "active") {
      const { done, total } = countProgress(stage, progress);
      badge = total > 0 ? `${done} / ${total} クリア` : "準備中（コンテンツ実装中）";
    } else {
      badge = "準備中";
    }

    li.innerHTML = `
      <span class="num">${stage.number}</span>
      <span class="title">${stage.title}</span>
      <span class="badge">${badge}</span>`;

    if (stage.status === "active") {
      li.addEventListener("click", () => onSelectStage(stage));
    }
    ladder.appendChild(li);
  }
}
