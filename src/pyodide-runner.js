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
 * Pyodide に同梱されず、PyPI から micropip で入れるパッケージ。
 * 段6 の emcee / corner はここに入る。
 */
const MICROPIP_PACKAGES = new Set(["emcee", "corner"]);

/**
 * 段で必要になったパッケージを遅延ロードする（段2以降で使う）。
 * 同梱パッケージは loadPackage、PyPI 専用パッケージは micropip で入れる。
 * @param {string[]} packages
 */
export async function ensurePackages(packages) {
  const pyodide = await getPyodide();
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (missing.length === 0) return;

  const bundled = missing.filter((p) => !MICROPIP_PACKAGES.has(p));
  const fromPypi = missing.filter((p) => MICROPIP_PACKAGES.has(p));

  if (bundled.length > 0) await pyodide.loadPackage(bundled);

  if (fromPypi.length > 0) {
    // micropip 自体は Pyodide 同梱。これで PyPI から emcee 等を入れる。
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    try {
      await micropip.install(fromPypi);
    } finally {
      micropip.destroy();
    }
  }

  missing.forEach((p) => loadedPackages.add(p));
}

// matplotlib を使う段（段3）の前後処理。
// SETUP: 非対話バックエンド Agg に固定し、前演習の図を消してから始める。
// CAPTURE: 学習者コードが描いた現在の図を base64 PNG 化して名前空間に置く。
const MPL_SETUP = [
  "import matplotlib",
  'matplotlib.use("Agg")',
  "import matplotlib.pyplot as plt",
  'plt.close("all")',
].join("\n");

const MPL_CAPTURE = [
  "def _pyladder_capture():",
  "    import base64, io",
  "    import matplotlib.pyplot as _plt",
  "    if not _plt.get_fignums():",
  "        return None",
  "    _buf = io.BytesIO()",
  '    _plt.gcf().savefig(_buf, format="png", dpi=90, bbox_inches="tight")',
  '    return base64.b64encode(_buf.getvalue()).decode("ascii")',
  "_pyladder_img = _pyladder_capture()",
].join("\n");

/** assert 失敗メッセージ（traceback 末尾の AssertionError 行）を取り出す。 */
function assertionDetail(message) {
  const lines = String(message || "").trim().split("\n");
  const last = lines[lines.length - 1] || "";
  const m = last.match(/AssertionError:?\s*(.*)/);
  return m && m[1] ? m[1] : "";
}

/**
 * traceback から Pyodide 内部フレーム（_pyodide/_base.py の eval_code/run 等）を
 * 取り除き、学習者のコード（<exec> フレーム）以降だけを残す。
 * @param {unknown} message
 * @returns {string}
 */
function trimTraceback(message) {
  const text = String(message || "");
  const lines = text.split("\n");
  if (!lines[0] || !lines[0].startsWith("Traceback")) return text;
  const execIdx = lines.findIndex((l) => l.includes('File "<exec>"'));
  if (execIdx === -1) return text; // <exec> が無い想定外の形はそのまま
  return [lines[0], ...lines.slice(execIdx)].join("\n");
}

/**
 * 演習を採点する。ユーザーコードを演習ごとに独立した名前空間で実行し、
 * 例外なら test を同じ名前空間で実行して合否を判定する。
 * @param {string} userCode 学習者のコード（starterCode を埋めたもの）
 * @param {string} testCode assert による採点コード
 * @param {string[]} [packages] この段で必要な追加パッケージ（pandas 等）
 * @returns {Promise<{status:string, stdout?:string, detail?:string,
 *                     errorType?:string, traceback?:string, image?:string}>}
 */
export async function gradeSubmission(userCode, testCode, packages = []) {
  // 空欄が残っていれば SyntaxError でなく親切に知らせる（CLAUDE.md）。
  if (userCode.includes("____")) {
    return { status: "blank" };
  }

  if (packages.length > 0) await ensurePackages(packages);
  const pyodide = await getPyodide();
  const ns = pyodide.toPy({}); // 演習ごとの新しい名前空間
  const usesMpl = packages.includes("matplotlib");
  let stdout = "";
  pyodide.setStdout({ batched: (msg) => (stdout += msg) });

  /** 名前空間に置かれた図（base64 PNG）を取り出す。無ければ undefined。 */
  const grabImage = () => {
    if (!usesMpl) return undefined;
    try {
      pyodide.runPython(MPL_CAPTURE, { globals: ns });
      return ns.get("_pyladder_img") || undefined;
    } catch {
      return undefined;
    }
  };

  try {
    // 段3: 図のバックエンドを固定し、前演習の図をクリアしてから実行する。
    if (usesMpl) pyodide.runPython(MPL_SETUP, { globals: ns });

    try {
      pyodide.runPython(userCode, { globals: ns });
    } catch (err) {
      return {
        status: "error",
        stdout,
        errorType: err.type || "Error",
        traceback: trimTraceback(err.message || err),
      };
    }

    const image = grabImage();

    try {
      pyodide.runPython(testCode, { globals: ns });
    } catch (err) {
      if ((err.type || "") === "AssertionError") {
        return { status: "fail", stdout, image, detail: assertionDetail(err.message) };
      }
      return {
        status: "error",
        stdout,
        image,
        errorType: err.type || "Error",
        traceback: trimTraceback(err.message || err),
      };
    }

    return { status: "pass", stdout, image };
  } finally {
    pyodide.setStdout(); // 既定の標準出力に戻す
    ns.destroy();
  }
}

/**
 * ドロップされたファイルを Pyodide の仮想ファイルシステムに書き込む。
 * 卒業課題が `np.loadtxt(path)` で読めるようにするため。
 * @param {string} path 仮想FS上のパス（例 "/data.phot.txt"）
 * @param {string} content ファイル内容（テキスト）
 */
export async function writeDataFile(path, content) {
  const pyodide = await getPyodide();
  pyodide.FS.writeFile(path, content);
}
