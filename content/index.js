// 全9段のコンテンツを集約する。ホーム画面はこの配列を並べる。
// MVP では段1のみ実装済み。他段はホームに「準備中」で並べるための
// プレースホルダ（status: "coming-soon"）。

import { stage0 } from "./stage-0.js";
import { stage1 } from "./stage-1.js";

/** ホームに「準備中」で並べる段のプレースホルダを作る。 */
function placeholder(number, title) {
  return {
    id: `stage-${number}`,
    number,
    title,
    intro: "",
    status: "coming-soon",
    lessons: [],
    capstone: null,
  };
}

/** @type {object[]} 段0〜段8。学習順に並べる。 */
export const stages = [
  stage0,
  stage1,
  placeholder(2, "pandas — 表データを読み込む"),
  placeholder(3, "matplotlib — グラフと残差を描く"),
  placeholder(4, "curve_fit — モデルを当てはめる"),
  placeholder(5, "フィット評価 — 残差・χ²・zスコア"),
  placeholder(6, "MCMC — emcee と corner plot"),
  placeholder(7, "Jupyter 運用 — セル順とカーネル"),
  placeholder(8, "実環境を整える力 — venv・pip・版数"),
];
