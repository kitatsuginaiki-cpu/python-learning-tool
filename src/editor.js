// コードエディタ部品。TECH_STACK の方針どおり、まずは textarea ベースの
// 最小実装。将来 CodeMirror に差し替える際の影響をこのファイルに閉じ込める
// （呼び出し側は el / getCode / setCode だけに依存する）。

/**
 * コードエディタを作る。
 * @param {string} initialCode
 * @returns {{ el: HTMLElement, getCode: () => string, setCode: (c: string) => void }}
 */
export function createEditor(initialCode) {
  const wrap = document.createElement("div");
  wrap.className = "editor";

  const ta = document.createElement("textarea");
  ta.className = "editor-area";
  ta.spellcheck = false;
  ta.autocapitalize = "off";
  ta.setAttribute("autocomplete", "off");
  ta.value = initialCode;
  ta.rows = Math.max(6, initialCode.split("\n").length + 1);

  // Tab はフォーカス移動でなく4スペース挿入にする。
  ta.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + "    " + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + 4;
  });

  wrap.appendChild(ta);

  return {
    el: wrap,
    getCode: () => ta.value,
    setCode: (code) => {
      ta.value = code;
      ta.rows = Math.max(6, code.split("\n").length + 1);
    },
  };
}
