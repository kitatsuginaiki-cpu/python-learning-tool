// 段5「フィット評価」。curve_fit の結果が良いかを残差・χ²・zスコアで判定する。
// 卒業課題で curve_fit を使うため packages: ["scipy"] で scipy を遅延ロードする。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage5 = {
  id: "stage-5",
  number: 5,
  title: "フィット評価 — 残差・χ²・zスコア",
  intro:
    "フィットは「当てはめて終わり」ではありません。残差・zスコア・換算χ² で" +
    "「そのフィットは信じてよいか」を数値で判定し、外れ値を見つける" +
    "――結果に責任を持つための評価作業を学びます。",
  status: "active",
  packages: ["scipy"],
  lessons: [
    // ----- L5-1 残差を計算する -----
    {
      id: "stage-5-lesson-1",
      title: "残差を計算する",
      explanation:
        "残差は「観測値 − モデル予測値」です。フィットが良ければ残差は 0 の" +
        "まわりに散らばります。モデル関数と最適パラメータ `popt` からは " +
        "`model(x, *popt)` で予測値が得られます（`*popt` は配列を引数に展開）。\n\n" +
        "**研究での出番**: フィット曲線と観測点のズレを点ごとに見ます。",
      exercises: [
        {
          id: "stage-5-lesson-1-ex-1",
          prompt: "観測値 `y` とモデル予測 `model` の残差を `resid` に入れよう。",
          starterCode: `import numpy as np

y     = np.array([10.2, 11.9, 14.1, 16.0])
model = np.array([10.0, 12.0, 14.0, 16.0])
resid = y - ____
print(resid)`,
          solutionCode: `import numpy as np

y     = np.array([10.2, 11.9, 14.1, 16.0])
model = np.array([10.0, 12.0, 14.0, 16.0])
resid = y - model
print(resid)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(resid, [0.2, -0.1, 0.1, 0.0]), " +
            "f'残差が違います: {resid}'",
          hints: [
            "残差は「観測 − モデル」。引くのはモデル予測値です。",
            "`y - model` と書きます。",
            "答え: 空欄は `model`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-5-lesson-1-ex-2",
          prompt:
            "モデル関数 `line` と最適パラメータ `popt` から残差を求めよう。",
          starterCode: `import numpy as np

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3])
y = np.array([1.1, 2.9, 5.2, 6.8])
popt = [2.0, 1.0]
resid = y - line(x, ____)
print(resid)`,
          solutionCode: `import numpy as np

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3])
y = np.array([1.1, 2.9, 5.2, 6.8])
popt = [2.0, 1.0]
resid = y - line(x, *popt)
print(resid)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(resid, y - (2.0 * x + 1.0)), " +
            "f'残差が違います: {resid}'",
          hints: [
            "`popt` は `[a, b]` の配列。これを引数に展開するには `*popt`。",
            "`line(x, *popt)` でモデル予測値が得られます。",
            "答え: 空欄は `*popt`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L5-2 zスコア（標準化残差） -----
    {
      id: "stage-5-lesson-2",
      title: "zスコア（標準化残差）",
      explanation:
        "残差そのものは、誤差の大きい点と小さい点を同列に扱ってしまいます。" +
        "残差を各点の誤差で割った **z = 残差 / 誤差**（標準化残差）にすると、" +
        "ばらつきを公平に比べられます。良いフィットなら z は概ね ±1〜2 に収まります。\n\n" +
        "**研究での出番**: 誤差の違う観測点を、同じものさしで評価します。",
      exercises: [
        {
          id: "stage-5-lesson-2-ex-1",
          prompt: "残差 `resid` を誤差 `err` で割って zスコア `z` を求めよう。",
          starterCode: `import numpy as np

resid = np.array([0.2, -0.4, 0.1, 0.6])
err   = np.array([0.1, 0.2, 0.1, 0.2])
z = resid / ____
print(z)`,
          solutionCode: `import numpy as np

resid = np.array([0.2, -0.4, 0.1, 0.6])
err   = np.array([0.1, 0.2, 0.1, 0.2])
z = resid / err
print(z)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(z, [2.0, -2.0, 1.0, 3.0]), f'z が違います: {z}'",
          hints: [
            "zスコアは「残差 ÷ 誤差」です。",
            "`resid / err` と書きます。",
            "答え: 空欄は `err`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-5-lesson-2-ex-2",
          prompt:
            "観測 `y`・モデル `model`・誤差 `err` から zスコア `z` を求めよう。",
          starterCode: `import numpy as np

y     = np.array([10.2, 11.6, 14.1])
model = np.array([10.0, 12.0, 14.0])
err   = np.array([0.1, 0.2, 0.1])
z = (y - model) / ____
print(z)`,
          solutionCode: `import numpy as np

y     = np.array([10.2, 11.6, 14.1])
model = np.array([10.0, 12.0, 14.0])
err   = np.array([0.1, 0.2, 0.1])
z = (y - model) / err
print(z)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(z, [2.0, -2.0, 1.0]), f'z が違います: {z}'",
          hints: [
            "まず残差 `y - model`、それを誤差で割ります。",
            "`(y - model) / err` です。",
            "答え: 空欄は `err`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L5-3 χ²を求める -----
    {
      id: "stage-5-lesson-3",
      title: "χ²を求める",
      explanation:
        "χ²（カイ二乗）は zスコアの二乗和 **χ² = Σ z²** です。フィット全体の" +
        "「ズレの総量」を1つの数にまとめたもの。`np.sum(z**2)` で計算します。\n\n" +
        "**研究での出番**: フィット同士の良し悪しを1つの指標で比べます。",
      exercises: [
        {
          id: "stage-5-lesson-3-ex-1",
          prompt: "zスコア `z` の二乗和としてχ²を求めよう。",
          starterCode: `import numpy as np

z = np.array([1.0, -2.0, 0.5, 1.5])
chi2 = np.sum(z**____)
print(chi2)`,
          solutionCode: `import numpy as np

z = np.array([1.0, -2.0, 0.5, 1.5])
chi2 = np.sum(z**2)
print(chi2)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(chi2, 7.5), f'χ² が違います: {chi2}'",
          hints: [
            "χ² は zスコアの「二乗」の和です。",
            "`z**2` の `np.sum` を取ります。",
            "答え: 空欄は `2`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-5-lesson-3-ex-2",
          prompt: "残差 `resid` と誤差 `err` から直接χ²を求めよう。",
          starterCode: `import numpy as np

resid = np.array([0.2, -0.4, 0.3])
err   = np.array([0.1, 0.2, 0.1])
chi2 = np.sum((____ / err)**2)
print(chi2)`,
          solutionCode: `import numpy as np

resid = np.array([0.2, -0.4, 0.3])
err   = np.array([0.1, 0.2, 0.1])
chi2 = np.sum((resid / err)**2)
print(chi2)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(chi2, 17.0), f'χ² が違います: {chi2}'",
          hints: [
            "`resid / err` が zスコア。その二乗和がχ²です。",
            "空欄には残差の配列が入ります。",
            "答え: 空欄は `resid`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L5-4 換算χ²（reduced χ²） -----
    {
      id: "stage-5-lesson-4",
      title: "換算χ²（reduced χ²）",
      explanation:
        "χ² は点数が多いほど大きくなるので、そのままでは良し悪しが分かりません。" +
        "点数 N からパラメータ数 n を引いた**自由度 dof = N − n** で割った" +
        "**換算χ² = χ² / dof** が品質の目安です。1 に近ければ良いフィット、" +
        "≫1 はモデル不足や誤差の過小評価、≪1 は誤差の過大評価を示します。\n\n" +
        "**研究での出番**: フィットを採用してよいかの最初の判断材料にします。",
      exercises: [
        {
          id: "stage-5-lesson-4-ex-1",
          prompt: "自由度 `dof` を「点数 − パラメータ数」で求めよう。",
          starterCode: `import numpy as np

chi2 = 48.0
N = 30          # データ点数
n_params = 4    # パラメータ数
dof = N - ____
red_chi2 = chi2 / dof
print("自由度 =", dof, "／ 換算χ² =", round(red_chi2, 3))`,
          solutionCode: `import numpy as np

chi2 = 48.0
N = 30          # データ点数
n_params = 4    # パラメータ数
dof = N - n_params
red_chi2 = chi2 / dof
print("自由度 =", dof, "／ 換算χ² =", round(red_chi2, 3))`,
          test:
            "assert dof == 26, f'自由度が違います: {dof}'\n" +
            "import numpy as np\n" +
            "assert np.isclose(red_chi2, 48.0 / 26), f'換算χ² が違います: {red_chi2}'",
          hints: [
            "自由度は「点数 − パラメータ数」。引くのはパラメータ数です。",
            "`N - n_params` と書きます。",
            "答え: 空欄は `n_params`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-5-lesson-4-ex-2",
          prompt: "χ²を自由度 `dof` で割って換算χ²を求めよう。",
          starterCode: `import numpy as np

chi2 = 31.5
N = 25
n_params = 4
dof = N - n_params
red_chi2 = chi2 / ____
print("換算χ² =", round(red_chi2, 3))`,
          solutionCode: `import numpy as np

chi2 = 31.5
N = 25
n_params = 4
dof = N - n_params
red_chi2 = chi2 / dof
print("換算χ² =", round(red_chi2, 3))`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(red_chi2, 31.5 / 21), f'換算χ² が違います: {red_chi2}'",
          hints: [
            "換算χ² は「χ² ÷ 自由度」です。",
            "割るのは `dof`。",
            "答え: 空欄は `dof`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L5-5 外れ値を見つける -----
    {
      id: "stage-5-lesson-5",
      title: "外れ値を見つける",
      explanation:
        "|z| が大きい点は、モデルから極端に外れた「外れ値」候補です。" +
        "`mask = np.abs(z) > 3` のようなブール索引で、外れ値を数えたり" +
        "除外したりできます（numpy のブール索引と同じ考え方）。\n\n" +
        "**研究での出番**: 雲・宇宙線などで汚れた測定点を解析から外します。",
      exercises: [
        {
          id: "stage-5-lesson-5-ex-1",
          prompt: "|z| が 3 を超える外れ値の数を `n_out` に入れよう。",
          starterCode: `import numpy as np

z = np.array([0.5, -1.2, 4.0, 0.8, -5.1])
mask = np.abs(z) > ____
n_out = np.sum(mask)
print("外れ値:", n_out, "個")`,
          solutionCode: `import numpy as np

z = np.array([0.5, -1.2, 4.0, 0.8, -5.1])
mask = np.abs(z) > 3
n_out = np.sum(mask)
print("外れ値:", n_out, "個")`,
          test:
            "assert int(n_out) == 2, f'外れ値の数が違います: {n_out}'",
          hints: [
            "外れ値の目安は |z| が 3 を超えること。",
            "`np.abs(z) > 3` が条件です。",
            "答え: 空欄は `3`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-5-lesson-5-ex-2",
          prompt: "外れ値でない（|z| が 3 未満の）良い点だけ `good` に残そう。",
          starterCode: `import numpy as np

z    = np.array([0.5, -1.2, 4.0, 0.8, -5.1])
flux = np.array([10, 11, 99, 12, 88])
good = flux[np.abs(z) ____ 3]
print(good)`,
          solutionCode: `import numpy as np

z    = np.array([0.5, -1.2, 4.0, 0.8, -5.1])
flux = np.array([10, 11, 99, 12, 88])
good = flux[np.abs(z) < 3]
print(good)`,
          test:
            "import numpy as np\n" +
            "assert np.array_equal(good, [10, 11, 12]), f'good が違います: {good}'",
          hints: [
            "「外れ値でない」は |z| が 3 より小さいこと。",
            "比較演算子 `<` を使います。",
            "答え: 空欄は `<`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-5-capstone",
    needsDataFile: true,
    blankLevel: "guided",
    prompt:
      "ドロップした `.phot.txt` の増光にガウス型フィットを行い、" +
      "換算χ² と外れ値（|z|>3）の数を求めて、フィットの質を評価しよう。",
    starterCode: `import numpy as np
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

# 増光ピーク付近（±60日）でガウス型フィット（段4と同じ）
peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y, e = hjd[near], flux[near], err[near]

def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

popt, pcov = curve_fit(model, t, y, p0=[130000, peak, 15, 0])

# --- フィット評価 ---
resid = y - model(t, *popt)
z = resid / ____                 # zスコア = 残差 / 誤差
chi2 = np.sum(z**2)
dof = t.size - ____              # 自由度 = 点数 − パラメータ数(4)
red_chi2 = chi2 / dof
n_out = np.sum(np.abs(z) > 3)

print("換算χ² =", round(red_chi2, 3))
print("外れ値（|z|>3）:", int(n_out), "/", t.size, "点")`,
    solutionCode: `import numpy as np
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y, e = hjd[near], flux[near], err[near]

def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

popt, pcov = curve_fit(model, t, y, p0=[130000, peak, 15, 0])

resid = y - model(t, *popt)
z = resid / e
chi2 = np.sum(z**2)
dof = t.size - 4
red_chi2 = chi2 / dof
n_out = np.sum(np.abs(z) > 3)

print("換算χ² =", round(red_chi2, 3))
print("外れ値（|z|>3）:", int(n_out), "/", t.size, "点")`,
    test: `import numpy as np
from scipy.optimize import curve_fit
_d = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
_h, _f, _er = _d[:, 0], _d[:, 1], _d[:, 2]
_peak = _h[np.argmax(_f)]
_n = np.abs(_h - _peak) < 60
_t, _y, _e = _h[_n], _f[_n], _er[_n]
def _m(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))
_popt, _ = curve_fit(_m, _t, _y, p0=[130000, _peak, 15, 0])
_z = (_y - _m(_t, *_popt)) / _e
_red = np.sum(_z**2) / (_t.size - 4)
assert np.isclose(red_chi2, _red, rtol=1e-3), f"換算χ² が違います: {red_chi2}"
assert int(n_out) == int(np.sum(np.abs(_z) > 3)), f"外れ値の数が違います: {n_out}"`,
    hints: [
      "zスコアは「残差 ÷ 誤差」。ここで誤差は `e` という名前です。",
      "自由度は「点数 − パラメータ数」。パラメータは A・t0・sigma・c の 4 個。",
      "空欄は順に `e` ／ `4` です。",
    ],
  },
};
