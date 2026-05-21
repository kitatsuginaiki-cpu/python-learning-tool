// 段2「pandas」。表データの読み込みと列・行の操作。
// pandas は起動時に読まれないため packages: ["pandas"] で遅延ロードする。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage2 = {
  id: "stage-2",
  number: 2,
  title: "pandas — 表データを読み込む",
  intro:
    "pandas は、行と列からなる「表（DataFrame）」を扱うライブラリです。" +
    "観測データをファイルから読み込み、列を取り出し、条件で行を絞り込む" +
    "――研究の解析でいちばん最初にやる作業を学びます。",
  status: "active",
  packages: ["pandas"],
  lessons: [
    // ----- L2-1 DataFrame を作る -----
    {
      id: "stage-2-lesson-1",
      title: "DataFrame を作る",
      explanation:
        "pandas の DataFrame は、行と列からなる表です。`pd.DataFrame({...})` " +
        "で、列名をキーにした辞書から作れます。`.shape` で（行数, 列数）、" +
        "`.columns` で列名がわかります。\n\n" +
        "**研究での出番**: 観測データを「表」としてまとめて扱います。",
      exercises: [
        {
          id: "stage-2-lesson-1-ex-1",
          prompt: "時刻と等級の辞書 `data` から DataFrame `df` を作ろう。",
          starterCode: `import pandas as pd

data = {"hjd": [2455.1, 2455.2, 2455.3], "mag": [18.2, 18.0, 17.9]}
df = pd.____(data)
print(df)`,
          solutionCode: `import pandas as pd

data = {"hjd": [2455.1, 2455.2, 2455.3], "mag": [18.2, 18.0, 17.9]}
df = pd.DataFrame(data)
print(df)`,
          test:
            "assert df.shape == (3, 2), f'df の形が違います: {df.shape}'\n" +
            "assert list(df.columns) == ['hjd', 'mag'], f'列名が違います: {list(df.columns)}'",
          hints: [
            "辞書から表を作る関数は `pd.DataFrame(...)` です。",
            "`pd.DataFrame(data)` と書きます。",
            "答え: 空欄は `DataFrame`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-2-lesson-1-ex-2",
          prompt: "DataFrame `df` の行数を `.shape` を使って `rows` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({"hjd": [1, 2, 3, 4], "mag": [18, 18, 18, 18]})
rows = df.shape[____]
print(rows)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({"hjd": [1, 2, 3, 4], "mag": [18, 18, 18, 18]})
rows = df.shape[0]
print(rows)`,
          test: "assert rows == 4, f'rows が違います: {rows}'",
          hints: [
            "`.shape` は（行数, 列数）のタプルです。",
            "行数は最初の要素なので番号 0。",
            "答え: 空欄は `0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L2-2 列を取り出す -----
    {
      id: "stage-2-lesson-2",
      title: "列を取り出す",
      explanation:
        "1つの列は `df[\"列名\"]` で取り出せます（取り出した1列を Series と" +
        "いいます）。複数列なら `df[[\"a\", \"b\"]]` のようにリストで指定します。\n\n" +
        "**研究での出番**: 必要な列だけ取り出して計算に使います。",
      exercises: [
        {
          id: "stage-2-lesson-2-ex-1",
          prompt: "DataFrame `df` から `mag` 列を取り出して `mags` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({"hjd": [2455.1, 2455.2, 2455.3], "mag": [18.2, 18.0, 17.9]})
mags = df[____]
print(mags)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({"hjd": [2455.1, 2455.2, 2455.3], "mag": [18.2, 18.0, 17.9]})
mags = df["mag"]
print(mags)`,
          test:
            "assert list(mags) == [18.2, 18.0, 17.9], f'mags が違います: {list(mags)}'",
          hints: [
            "1列を取り出すには `df[\"列名\"]` と書きます。",
            "`df[\"mag\"]` です。",
            "答え: 空欄は `\"mag\"`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-2-lesson-2-ex-2",
          prompt: "`hjd` と `mag` の2列だけを取り出して `sub` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({
    "hjd": [2455.1, 2455.2, 2455.3],
    "mag": [18.2, 18.0, 17.9],
    "err": [0.05, 0.08, 0.06],
})
sub = df[____]
print(sub)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({
    "hjd": [2455.1, 2455.2, 2455.3],
    "mag": [18.2, 18.0, 17.9],
    "err": [0.05, 0.08, 0.06],
})
sub = df[["hjd", "mag"]]
print(sub)`,
          test:
            "assert list(sub.columns) == ['hjd', 'mag'], f'sub の列が違います: {list(sub.columns)}'",
          hints: [
            "複数列は、列名のリストを渡します: `df[[ ... ]]`。",
            "`df[[\"hjd\", \"mag\"]]` です（角かっこが二重）。",
            "答え: 空欄は `[\"hjd\", \"mag\"]`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L2-3 行を絞り込む -----
    {
      id: "stage-2-lesson-3",
      title: "行を絞り込む",
      explanation:
        "条件で行を選びます。`df[df[\"err\"] < 0.1]` のように、True/False の" +
        "列を `df[...]` に渡すと、True の行だけが残ります（numpy のブール索引と" +
        "同じ考え方）。\n\n" +
        "**研究での出番**: 誤差の大きい観測行を解析から外します。",
      exercises: [
        {
          id: "stage-2-lesson-3-ex-1",
          prompt: "誤差 `err` が 0.1 未満の行だけ取り出して `good` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({
    "mag": [18.2, 18.0, 17.9, 18.1],
    "err": [0.05, 0.30, 0.08, 0.40],
})
good = df[df[____] < 0.1]
print(good)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({
    "mag": [18.2, 18.0, 17.9, 18.1],
    "err": [0.05, 0.30, 0.08, 0.40],
})
good = df[df["err"] < 0.1]
print(good)`,
          test:
            "assert good.shape[0] == 2, f'good の行数が違います: {good.shape[0]}'\n" +
            "assert list(good['mag']) == [18.2, 17.9], f'good の中身が違います: {list(good[\"mag\"])}'",
          hints: [
            "まず条件の列を作ります: `df[\"err\"] < 0.1`。",
            "それを `df[...]` に渡すと、条件に合う行だけ残ります。",
            "答え: 空欄は `\"err\"`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-2-lesson-3-ex-2",
          prompt:
            "等級が 18.0 より明るい（小さい）行の数を `n_bright` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({"mag": [18.2, 17.9, 18.1, 17.8, 18.3]})
bright = df[df["mag"] < ____]
n_bright = bright.shape[0]
print(n_bright)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({"mag": [18.2, 17.9, 18.1, 17.8, 18.3]})
bright = df[df["mag"] < 18.0]
n_bright = bright.shape[0]
print(n_bright)`,
          test: "assert n_bright == 2, f'n_bright が違います: {n_bright}'",
          hints: [
            "「18.0 より明るい」は「mag が 18.0 より小さい」。",
            "`df[\"mag\"] < 18.0` が条件です。",
            "答え: 空欄は `18.0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L2-4 新しい列を作る -----
    {
      id: "stage-2-lesson-4",
      title: "新しい列を作る",
      explanation:
        "`df[\"新しい列\"] = 式` で列を追加できます。既存の列を使った計算は、" +
        "列全体にまとめて適用されます（numpy のベクトル化と同じ）。\n\n" +
        "**研究での出番**: 観測値とモデルの差（残差）の列を足す、などに使います。",
      exercises: [
        {
          id: "stage-2-lesson-4-ex-1",
          prompt: "`flux` 列を1000倍した `flux_scaled` 列を df に追加しよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({"flux": [1.5, 0.5, 2.0]})
df["flux_scaled"] = df["flux"] * ____
print(df)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({"flux": [1.5, 0.5, 2.0]})
df["flux_scaled"] = df["flux"] * 1000
print(df)`,
          test:
            "assert list(df['flux_scaled']) == [1500.0, 500.0, 2000.0], " +
            "f'flux_scaled が違います: {list(df[\"flux_scaled\"])}'",
          hints: [
            "列に数値を掛けると、全要素にまとめて効きます。",
            "`df[\"flux\"] * 1000` を新しい列に入れます。",
            "答え: 空欄は `1000`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-2-lesson-4-ex-2",
          prompt:
            "観測 `obs` とモデル `model` の差を `resid` 列として追加しよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({
    "obs": [18.2, 18.0, 17.9],
    "model": [18.0, 18.0, 18.0],
})
df["resid"] = df["obs"] - df[____]
print(df)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({
    "obs": [18.2, 18.0, 17.9],
    "model": [18.0, 18.0, 18.0],
})
df["resid"] = df["obs"] - df["model"]
print(df)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(df['resid'], [0.2, 0.0, -0.1]), " +
            "f'resid が違います: {list(df[\"resid\"])}'",
          hints: [
            "列どうしの引き算は、行ごとに計算されます。",
            "`df[\"obs\"] - df[\"model\"]` です。",
            "答え: 空欄は `\"model\"`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L2-5 統計と集約 -----
    {
      id: "stage-2-lesson-5",
      title: "統計と集約",
      explanation:
        "列（Series）には `.mean()` `.median()` `.std()` `.min()` `.max()` " +
        "などの集約メソッドがあります。絞り込んだあとの列にもそのまま使えます。\n\n" +
        "**研究での出番**: 観測の典型値やばらつきを把握します。",
      exercises: [
        {
          id: "stage-2-lesson-5-ex-1",
          prompt: "`mag` 列の中央値を `med` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({"mag": [18.2, 18.0, 17.9, 25.0, 18.1]})
med = df["mag"].____()
print(med)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({"mag": [18.2, 18.0, 17.9, 25.0, 18.1]})
med = df["mag"].median()
print(med)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(med, 18.1), f'med が違います: {med}'",
          hints: [
            "中央値を求めるメソッドは `.median()` です。",
            "`df[\"mag\"].median()` と書きます。",
            "答え: 空欄は `median`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-2-lesson-5-ex-2",
          prompt:
            "誤差 0.1 未満の行だけに絞り、その `mag` の平均を `m` に入れよう。",
          starterCode: `import pandas as pd

df = pd.DataFrame({
    "mag": [18.0, 20.0, 17.0, 16.0],
    "err": [0.05, 0.08, 0.50, 0.06],
})
good = df[df["err"] < 0.1]
m = good["mag"].____()
print(m)`,
          solutionCode: `import pandas as pd

df = pd.DataFrame({
    "mag": [18.0, 20.0, 17.0, 16.0],
    "err": [0.05, 0.08, 0.50, 0.06],
})
good = df[df["err"] < 0.1]
m = good["mag"].mean()
print(m)`,
          test: "assert m == 18.0, f'm が違います: {m}'",
          hints: [
            "平均を求めるメソッドは `.mean()` です。",
            "絞り込んだ `good` の `mag` 列に `.mean()` を使います。",
            "答え: 空欄は `mean`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-2-capstone",
    needsDataFile: true,
    blankLevel: "guided",
    prompt:
      "ドロップした `.phot.txt` を pandas で読み込み、誤差が中央値より" +
      "大きい行を外して、残った行の `flux` の中央値 `med` を求めよう。",
    starterCode: `import pandas as pd

# .phot.txt を表として読み込む（空白区切り・# はコメント・ヘッダ無し）
df = pd.read_csv(
    "/data.phot.txt",
    sep=r"\\s+", comment="#", header=None,
    names=["hjd", "flux", "err", "name"],
)

# 誤差が「誤差の中央値」より小さい良い行だけ残す
err_med = df["err"].median()
good = df[df["err"] < ____]

# 良い行のフラックスの中央値
med = good["flux"].____()

print("全行:", df.shape[0], "／ 良い行:", good.shape[0])
print("フラックス中央値:", med)`,
    solutionCode: `import pandas as pd

df = pd.read_csv(
    "/data.phot.txt",
    sep=r"\\s+", comment="#", header=None,
    names=["hjd", "flux", "err", "name"],
)

err_med = df["err"].median()
good = df[df["err"] < err_med]

med = good["flux"].median()

print("全行:", df.shape[0], "／ 良い行:", good.shape[0])
print("フラックス中央値:", med)`,
    test: `import pandas as pd
import numpy as np
_df = pd.read_csv("/data.phot.txt", sep=r"\\s+", comment="#", header=None,
                  names=["hjd", "flux", "err", "name"])
_good = _df[_df["err"] < _df["err"].median()]
assert df.shape[0] == _df.shape[0], "読み込み行数が違います"
assert good.shape[0] == _good.shape[0], f"良い行の数が違います: {good.shape[0]}"
assert np.isclose(med, _good["flux"].median()), f"中央値が違います: {med}"`,
    hints: [
      "良い行は `df[\"err\"] < err_med`（誤差が中央値より小さい）で絞ります。",
      "中央値を求めるメソッドは `.median()` です。",
      "空欄は順に `err_med` ／ `median` です。",
    ],
  },
};
