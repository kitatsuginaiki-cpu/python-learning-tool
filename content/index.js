// 全9段のコンテンツを集約する。ホーム画面はこの配列を並べる。
// 段0〜段8 まで全段実装済み（到達ラダー完成）。

import { stage0 } from "./stage-0.js";
import { stage1 } from "./stage-1.js";
import { stage2 } from "./stage-2.js";
import { stage3 } from "./stage-3.js";
import { stage4 } from "./stage-4.js";
import { stage5 } from "./stage-5.js";
import { stage6 } from "./stage-6.js";
import { stage7 } from "./stage-7.js";
import { stage8 } from "./stage-8.js";

/** @type {object[]} 段0〜段8。学習順に並べる。 */
export const stages = [
  stage0,
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  stage6,
  stage7,
  stage8,
];
