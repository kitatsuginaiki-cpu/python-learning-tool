// 学習進捗の localStorage 入出力。localStorage に触れるのはこのモジュールだけ
// （CLAUDE.md / DATA_MODEL.md）。

const KEY = "pyladder:progress";
const SCHEMA_VERSION = 1;

/** @returns {object} 初期状態の進捗データ */
function fresh() {
  return {
    schemaVersion: SCHEMA_VERSION,
    clearedExercises: [],
    lastVisited: null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 進捗を読み込む。未保存・壊れている・版数違いなら安全に初期化する。
 * @returns {object}
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const data = JSON.parse(raw);
    if (data.schemaVersion !== SCHEMA_VERSION) return fresh();
    if (!Array.isArray(data.clearedExercises)) return fresh();
    return data;
  } catch {
    return fresh();
  }
}

/** @param {object} progress 進捗データを保存する */
export function saveProgress(progress) {
  progress.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(progress));
}

/**
 * 演習がクリア済みか。
 * @param {object} progress
 * @param {string} exerciseId
 */
export function isCleared(progress, exerciseId) {
  return progress.clearedExercises.includes(exerciseId);
}

/**
 * 演習をクリア済みにして保存する。
 * @param {object} progress
 * @param {string} exerciseId
 */
export function markCleared(progress, exerciseId) {
  if (!progress.clearedExercises.includes(exerciseId)) {
    progress.clearedExercises.push(exerciseId);
    saveProgress(progress);
  }
  return progress;
}

/** 進捗をすべて消す（ホームの「リセット」用）。 */
export function resetProgress() {
  localStorage.removeItem(KEY);
}
