// 解説文の最小 Markdown 描画。対応するのは段落・**強調**・`インラインコード`。
// 解説は短い散文なので、見出しや箇条書きまでは扱わない。

/** HTML 特殊文字をエスケープする。 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 最小 Markdown を HTML 文字列に変換する。
 * @param {string} md
 * @returns {string}
 */
export function renderMarkdown(md) {
  return String(md || "")
    .split(/\n\n+/)
    .map((para) => {
      let h = escapeHtml(para);
      h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
      h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      h = h.replace(/\n/g, "<br>");
      return `<p>${h}</p>`;
    })
    .join("");
}
