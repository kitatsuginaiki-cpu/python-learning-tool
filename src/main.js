// アプリの起点。Pyodide をロードし、ビューを切り替える。

import { getPyodide } from "./pyodide-runner.js";
import { renderLoading } from "./views/loading.js";
import { renderHome } from "./views/home.js";
import { stages } from "../content/index.js";

const app = document.getElementById("app");

/** ホーム（ラダー）を表示する。 */
function showHome() {
  renderHome(app, { stages, onSelectStage });
}

/** 段が選ばれたとき。レッスン画面は実装フェーズ(2)で追加する。 */
function onSelectStage(stage) {
  // TODO(実装フェーズ2): レッスン画面へ遷移する
  alert(`「${stage.title}」のレッスン画面は実装中です。`);
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
