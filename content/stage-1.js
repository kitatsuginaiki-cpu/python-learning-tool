// 段1「numpy」のコンテンツ。MVP の縦スライス。
// レッスン（L1-1〜L1-5）と卒業課題は実装フェーズ(3)(4)で追加する。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage1 = {
  id: "stage-1",
  number: 1,
  title: "numpy — 配列で測定データを扱う",
  intro:
    "測光データは数値の列です。numpy の配列を使うと、たくさんの測定値を" +
    "まとめて計算したり、条件で絞り込んだりできます。この段では、研究の" +
    "解析でそのまま使う numpy だけを学びます。",
  status: "active",
  lessons: [
    // 実装(2): まず L1-4 を1問入れて「解ける」状態にする。
    // 残りの L1-1〜L1-3・L1-5 は実装(3)で追加する。
    {
      id: "stage-1-lesson-4",
      title: "ブール索引 — 悪い測定点を外す",
      explanation:
        "測定には誤差の大きい「悪い点」が混じります。numpy では " +
        "`True`/`False` の配列（マスク）を作り、条件に合う要素だけを" +
        "取り出せます。\n\n" +
        "**研究での出番**: 誤差が大きすぎる測定点を解析から外すときに使います。",
      exercises: [
        {
          id: "stage-1-lesson-4-ex-1",
          prompt:
            "配列 `mag` のうち、誤差 `err` が 0.1 より小さい「良い測定点」" +
            "だけを取り出して `good` に入れよう。",
          starterCode:
            "import numpy as np\n" +
            "mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])\n" +
            "err = np.array([0.05, 0.30, 0.08, 0.40, 0.06])\n" +
            "\n" +
            "mask = ____          # err が 0.1 より小さいか の True/False 配列\n" +
            "good = mag[____]     # mask を使って mag を絞り込む\n" +
            "print(good)",
          solutionCode:
            "import numpy as np\n" +
            "mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])\n" +
            "err = np.array([0.05, 0.30, 0.08, 0.40, 0.06])\n" +
            "\n" +
            "mask = err < 0.1\n" +
            "good = mag[mask]\n" +
            "print(good)",
          test:
            'assert good.tolist() == [18.2, 17.9, 18.3], f"good が違います: {good}"',
          hints: [
            "ブール索引はまず True/False の配列（マスク）を作ります。`err < 0.1` がそれです。",
            "`mag[mask]` のように配列へ True/False 配列を渡すと、True の位置だけ残ります。",
            "答え: `mask = err < 0.1` ／ `good = mag[mask]`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: null, // 卒業課題は実装フェーズ(4)で追加
};
