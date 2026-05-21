// アプリの起点。Pyodide をロードし、ビューを切り替える。

import { getPyodide } from "./pyodide-runner.js";
import { renderLoading } from "./views/loading.js";
import { renderHome } from "./views/home.js";
import { renderLesson } from "./views/lesson.js";
import { stages } from "../content/index.js";

const app = document.getElementById("app");

/** ホーム（ラダー）を表示する。 */
function showHome() {
  renderHome(app, { stages, onSelectStage });
}

/** 段が選ばれたとき。その段の最初のレッスンを開く。 */
function onSelectStage(stage) {
  if (stage.lessons.length === 0) {
    alert(`「${stage.title}」のレッスンは準備中です。`);
    return;
  }
  showLesson(stage, 0);
}

/** 段内の指定レッスンを表示する。 */
function showLesson(stage, lessonIndex) {
  renderLesson(app, {
    stage,
    lessonIndex,
    onBackHome: showHome,
    onGoLesson: (i) => showLesson(stage, i),
  });
}

/** 起動: ロード画面 → Pyodide ロード → ホーム。 */
async function boot() {
  const loading = renderLoading(app);
  try {
    await getPyodide(loading.setStatus);
    showHome();
  } catch (e) {
    loading.setError(e);
    console.error(e);
  }
}

boot();
