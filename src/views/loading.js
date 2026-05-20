// S1 起動・ロード画面。Pyodide ロード中のプログレスを表示する。

/**
 * ロード画面を描画する。
 * @param {HTMLElement} container
 * @returns {{ setStatus: (msg: string) => void, setError: (e: unknown) => void }}
 */
export function renderLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <h1>PyLadder</h1>
      <p class="lead">研究に必要な Python を、環境で詰まらず学ぶ</p>
      <div class="progress"><div class="bar"></div></div>
      <p class="status">起動中…</p>
    </div>`;

  const statusEl = container.querySelector(".status");
  const barEl = container.querySelector(".bar");
  let step = 0;

  return {
    setStatus(msg) {
      statusEl.textContent = msg;
      step += 1;
      barEl.style.width = Math.min(step * 33, 100) + "%";
    },
    setError(e) {
      statusEl.textContent = "読み込みに失敗しました: " + e;
      statusEl.classList.add("error");
    },
  };
}
