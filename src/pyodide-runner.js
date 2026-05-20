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

/** assert 失敗メッセージ（traceback 末尾の AssertionError 行）を取り出す。 */
function assertionDetail(message) {
  const lines = String(message || "").trim().split("\n");
  const last = lines[lines.length - 1] || "";
  const m = last.match(/AssertionError:?\s*(.*)/);
  return m && m[1] ? m[1] : "";
}

/**
 * 演習を採点する。ユーザーコードを演習ごとに独立した名前空間で実行し、
 * 例外なら test を同じ名前空間で実行して合否を判定する。
 * @param {string} userCode 学習者のコード（starterCode を埋めたもの）
 * @param {string} testCode assert による採点コード
 * @returns {Promise<{status:string, stdout?:string, detail?:string,
 *                     errorType?:string, traceback?:string}>}
 */
export async function gradeSubmission(userCode, testCode) {
  // 空欄が残っていれば SyntaxError でなく親切に知らせる（CLAUDE.md）。
  if (userCode.includes("____")) {
    return { status: "blank" };
  }

  const pyodide = await getPyodide();
  const ns = pyodide.toPy({}); // 演習ごとの新しい名前空間
  let stdout = "";
  pyodide.setStdout({ batched: (msg) => (stdout += msg) });

  try {
    try {
      pyodide.runPython(userCode, { globals: ns });
    } catch (err) {
      return {
        status: "error",
        stdout,
        errorType: err.type || "Error",
        traceback: String(err.message || err),
      };
    }

    try {
      pyodide.runPython(testCode, { globals: ns });
    } catch (err) {
      if ((err.type || "") === "AssertionError") {
        return { status: "fail", stdout, detail: assertionDetail(err.message) };
      }
      return {
        status: "error",
        stdout,
        errorType: err.type || "Error",
        traceback: String(err.message || err),
      };
    }

    return { status: "pass", stdout };
  } finally {
    pyodide.setStdout(); // 既定の標準出力に戻す
    ns.destroy();
  }
}
