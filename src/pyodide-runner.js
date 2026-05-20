// Pyodide のロードと Python 実行を集約するモジュール。
// view からは直接 Pyodide を触らず、必ずここを経由する（CLAUDE.md）。

/** @type {Promise<any> | null} ロード済み Pyodide のキャッシュ */
let pyodidePromise = null;

/** すでに loadPackage 済みのパッケージ名 */
const loadedPackages = new Set();

/**
 * Pyodide コアと numpy を一度だけロードする。
 * 段ごとの遅延ロード方針: MVP（段1）は numpy のみ。
 * @param {(msg: string) => void} [onProgress] 進捗メッセージのコールバック
 * @returns {Promise<any>} Pyodide インスタンス
 */
export function getPyodide(onProgress) {
  if (!pyodidePromise) {
    pyodidePromise = boot(onProgress);
  }
  return pyodidePromise;
}

async function boot(onProgress) {
  onProgress?.("Python 環境を準備中…");
  // loadPyodide は index.html の CDN スクリプトが定義するグローバル
  const pyodide = await loadPyodide();
  onProgress?.("numpy を読み込み中…");
  await pyodide.loadPackage("numpy");
  loadedPackages.add("numpy");
  onProgress?.("準備完了");
  return pyodide;
}

/**
 * 段で必要になったパッケージを遅延ロードする（段2以降で使う）。
 * @param {string[]} packages
 */
export async function ensurePackages(packages) {
  const pyodide = await getPyodide();
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (missing.length === 0) return;
  await pyodide.loadPackage(missing);
  missing.forEach((p) => loadedPackages.add(p));
}
