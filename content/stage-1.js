// 段1「numpy」のコンテンツ。MVP の縦スライス。
// レッスン L1-1〜L1-5。卒業課題（capstone）は実装フェーズ(4)で追加する。
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
    // ----- L1-1 配列を作る -----
    {
      id: "stage-1-lesson-1",
      title: "配列を作る",
      explanation:
        "研究の測定データは数値の列です。Python のリストを `np.array()` に" +
        "渡すと numpy 配列になります。配列は `.shape` で要素数（形）、" +
        "`.dtype` でデータ型がわかります。\n\n" +
        "**研究での出番**: 観測した時刻や明るさの列を、まとめて1つの配列にします。",
      exercises: [
        {
          id: "stage-1-lesson-1-ex-1",
          prompt:
            "観測時刻のリスト `times_list` を numpy 配列 `times` に変換しよう。",
          starterCode: `import numpy as np
times_list = [2455.1, 2455.2, 2455.3, 2455.4]

times = ____
print(times)`,
          solutionCode: `import numpy as np
times_list = [2455.1, 2455.2, 2455.3, 2455.4]

times = np.array(times_list)
print(times)`,
          test:
            "assert isinstance(times, np.ndarray), 'times が numpy 配列ではありません'\n" +
            "assert times.tolist() == [2455.1, 2455.2, 2455.3, 2455.4]",
          hints: [
            "リストを numpy 配列にするには `np.array(...)` を使います。",
            "`np.array(times_list)` でリストが配列に変わります。",
            "答え: `times = np.array(times_list)`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-1-lesson-1-ex-2",
          prompt:
            "配列 `flux` の測定点の数を `.shape` を使って `n` に入れよう。",
          starterCode: `import numpy as np
flux = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

n = flux.shape[____]
print("測定点の数:", n)`,
          solutionCode: `import numpy as np
flux = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

n = flux.shape[0]
print("測定点の数:", n)`,
          test: "assert n == 5, f'n が違います: {n}'",
          hints: [
            "`.shape` は各次元の大きさを並べたタプルです。1次元配列なら `(要素数,)`。",
            "最初の次元の大きさは番号 0 で取れます: `flux.shape[0]`。",
            "答え: `n = flux.shape[0]`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L1-2 要素アクセスとスライス -----
    {
      id: "stage-1-lesson-2",
      title: "要素アクセスとスライス",
      explanation:
        "配列の一部を取り出します。番号は 0 から始まり、`arr[0]` が先頭、" +
        "`arr[-1]` が末尾です。`arr[2:5]` のスライスは「2 以上 5 未満」で、" +
        "**終わりの番号は含みません**。\n\n" +
        "**研究での出番**: 観測のうち特定の期間だけを切り出して調べます。",
      exercises: [
        {
          id: "stage-1-lesson-2-ex-1",
          prompt:
            "配列 `mag` の最初の測定値を `first`、最後の測定値を `last` に入れよう。",
          starterCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

first = mag[____]
last = mag[____]
print(first, last)`,
          solutionCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

first = mag[0]
last = mag[-1]
print(first, last)`,
          test:
            "assert first == 18.2, f'first が違います: {first}'\n" +
            "assert last == 18.3, f'last が違います: {last}'",
          hints: [
            "先頭の要素は番号 0 です: `mag[0]`。",
            "末尾は `-1` で取れます: `mag[-1]`。",
            "答え: `first = mag[0]` ／ `last = mag[-1]`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-1-lesson-2-ex-2",
          prompt:
            "配列 `mag` の真ん中の3点（番号 1・2・3）を `middle` に取り出そう。",
          starterCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

middle = mag[____]
print(middle)`,
          solutionCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])

middle = mag[1:4]
print(middle)`,
          test:
            "assert middle.tolist() == [18.0, 17.9, 18.1], f'middle が違います: {middle}'",
          hints: [
            "スライス `arr[開始:終了]` は終了の番号を含みません。",
            "番号 1・2・3 が欲しいので、終了は 4 にします: `1:4`。",
            "答え: `middle = mag[1:4]`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L1-3 配列の演算 -----
    {
      id: "stage-1-lesson-3",
      title: "配列の演算",
      explanation:
        "配列は、数値との計算も、配列どうしの計算もできます。`arr * 2` は" +
        "全要素が2倍になります（これをベクトル化といいます）。同じ長さの" +
        "配列どうしは、要素ごとに計算されます。\n\n" +
        "**研究での出番**: 観測値とモデル値の差（残差）を一気に計算します。",
      exercises: [
        {
          id: "stage-1-lesson-3-ex-1",
          prompt: "フラックス `flux` を全要素 1000 倍して `scaled` に入れよう。",
          starterCode: `import numpy as np
flux = np.array([1.2, 0.8, 1.5])

scaled = ____
print(scaled)`,
          solutionCode: `import numpy as np
flux = np.array([1.2, 0.8, 1.5])

scaled = flux * 1000
print(scaled)`,
          test:
            "assert np.allclose(scaled, [1200.0, 800.0, 1500.0]), f'scaled が違います: {scaled}'",
          hints: [
            "配列に数値を掛けると、全要素にまとめて効きます（ベクトル化）。",
            "`flux * 1000` で全要素が1000倍になります。",
            "答え: `scaled = flux * 1000`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-1-lesson-3-ex-2",
          prompt:
            "観測値 `obs` とモデル値 `model` の差（残差）を `resid` に入れよう。",
          starterCode: `import numpy as np
obs   = np.array([18.2, 18.0, 17.9])
model = np.array([18.0, 18.0, 18.0])

resid = ____
print(resid)`,
          solutionCode: `import numpy as np
obs   = np.array([18.2, 18.0, 17.9])
model = np.array([18.0, 18.0, 18.0])

resid = obs - model
print(resid)`,
          test:
            "assert np.allclose(resid, [0.2, 0.0, -0.1]), f'resid が違います: {resid}'",
          hints: [
            "同じ長さの配列どうしは、要素ごとに引き算できます。",
            "`obs - model` で各点の残差が一度に求まります。",
            "答え: `resid = obs - model`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L1-4 ブール索引 -----
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
          starterCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])
err = np.array([0.05, 0.30, 0.08, 0.40, 0.06])

mask = ____          # err が 0.1 より小さいか の True/False 配列
good = mag[____]     # mask を使って mag を絞り込む
print(good)`,
          solutionCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 18.1, 18.3])
err = np.array([0.05, 0.30, 0.08, 0.40, 0.06])

mask = err < 0.1
good = mag[mask]
print(good)`,
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

    // ----- L1-5 統計関数 -----
    {
      id: "stage-1-lesson-5",
      title: "統計関数 — 中央値と MAD",
      explanation:
        "numpy には統計の関数があります。`np.mean` は平均、`np.median` は" +
        "中央値、`np.std` は標準偏差です。中央値や MAD（中央絶対偏差）は" +
        "外れ値に強く、悪い測定点があっても代表値がぶれにくいのが特徴です。\n\n" +
        "**研究での出番**: 測定の典型値を求め、外れ値を見つける基準にします。",
      exercises: [
        {
          id: "stage-1-lesson-5-ex-1",
          prompt:
            "配列 `mag` の中央値を `med` に入れよう（外れ値 25.0 が混じっている）。",
          starterCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 25.0, 18.1])  # 25.0 は外れ値

med = ____
print("中央値:", med)`,
          solutionCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 25.0, 18.1])  # 25.0 は外れ値

med = np.median(mag)
print("中央値:", med)`,
          test: "assert np.isclose(med, 18.1), f'med が違います: {med}'",
          hints: [
            "中央値は `np.median(...)` で求めます。平均（mean）と違い外れ値に強いです。",
            "`np.median(mag)` を `med` に入れます。",
            "答え: `med = np.median(mag)`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-1-lesson-5-ex-2",
          prompt:
            "MAD（中央絶対偏差）を求めよう。各点と中央値の差の絶対値をとり、" +
            "その中央値を `mad` に入れる。",
          starterCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 25.0, 18.1])

med = np.median(mag)
mad = np.median(np.abs(mag - ____))
print("中央値:", med, " MAD:", mad)`,
          solutionCode: `import numpy as np
mag = np.array([18.2, 18.0, 17.9, 25.0, 18.1])

med = np.median(mag)
mad = np.median(np.abs(mag - med))
print("中央値:", med, " MAD:", mad)`,
          test: "assert np.isclose(mad, 0.1), f'mad が違います: {mad}'",
          hints: [
            "MAD は「各点と中央値の差の絶対値」の中央値。差をとる相手は中央値 `med` です。",
            "`np.abs(mag - med)` が絶対偏差の配列。その `np.median` が MAD。",
            "答え: `mad = np.median(np.abs(mag - med))`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: null, // 卒業課題は実装フェーズ(4)で追加
};
