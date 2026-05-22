// 段4「curve_fit」。モデル関数をデータに最小二乗で当てはめる。
// scipy は起動時に読まれないため packages: ["scipy"] で遅延ロードする。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage4 = {
  id: "stage-4",
  number: 4,
  title: "curve_fit — モデルを当てはめる",
  intro:
    "curve_fit は、観測データに数式モデルを最小二乗で当てはめる関数です。" +
    "モデルを Python 関数で書き、初期値を与え、最適なパラメータと" +
    "その誤差を求める――解析の中心になる作業を学びます。",
  status: "active",
  packages: ["scipy"],
  lessons: [
    // ----- L4-1 モデル関数を定義する -----
    {
      id: "stage-4-lesson-1",
      title: "モデル関数を定義する",
      explanation:
        "フィットは「データに合わせたい数式」を Python 関数で書くことから" +
        "始まります。約束ごとは1つ――**第1引数が x（横軸）、残りの引数が" +
        "パラメータ**です。\n\n" +
        "**研究での出番**: 増光モデルや直線（ベースライン）を関数として用意します。",
      exercises: [
        {
          id: "stage-4-lesson-1-ex-1",
          prompt: "直線モデル `a*x + b` を返すように、空欄を埋めよう。",
          starterCode: `def model(x, a, b):
    return a * x + ____

print(model(2, 3, 1))   # 3*2 + 1 = 7 になるはず`,
          solutionCode: `def model(x, a, b):
    return a * x + b

print(model(2, 3, 1))   # 3*2 + 1 = 7 になるはず`,
          test:
            "assert model(2, 3, 1) == 7, f'model(2,3,1) が違います: {model(2,3,1)}'\n" +
            "assert model(0, 5, 4) == 4, f'切片の扱いが違います: {model(0,5,4)}'",
          hints: [
            "直線は「傾き × x ＋ 切片」。切片はパラメータ `b` です。",
            "`return a * x + b` と書きます。",
            "答え: 空欄は `b`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-4-lesson-1-ex-2",
          prompt:
            "ガウス型モデルの「幅」を表すパラメータ `sigma` を空欄に入れよう。",
          starterCode: `import numpy as np

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * ____**2))

print(round(gauss(0, 1, 0, 1), 4))   # 中心では 1.0 になるはず`,
          solutionCode: `import numpy as np

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

print(round(gauss(0, 1, 0, 1), 4))   # 中心では 1.0 になるはず`,
          test:
            "import numpy as np\n" +
            "assert round(gauss(0, 1, 0, 1), 6) == 1.0, '中心の値が違います'\n" +
            "assert np.isclose(gauss(1, 1, 0, 1), np.exp(-0.5)), " +
            "f'幅の扱いが違います: {gauss(1,1,0,1)}'",
          hints: [
            "ガウス型の分母にある「幅」のパラメータは `sigma` です。",
            "`2 * sigma**2` と書きます。",
            "答え: 空欄は `sigma`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L4-2 curve_fit で当てはめる -----
    {
      id: "stage-4-lesson-2",
      title: "curve_fit で当てはめる",
      explanation:
        "`from scipy.optimize import curve_fit` で読み込みます。" +
        "`curve_fit(モデル関数, x, y)` は、モデルをデータに最小二乗で当てはめ、" +
        "`(popt, pcov)` の2つを返します。**popt が最適パラメータの配列**で、" +
        "モデル関数の引数順に並びます。\n\n" +
        "**研究での出番**: 観測点に増光モデルを当てはめてパラメータを求めます。",
      exercises: [
        {
          id: "stage-4-lesson-2-ex-1",
          prompt: "直線 `line` をデータ `x, y` に当てはめよう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 3, 5, 7, 9])      # a=2, b=1 のはず
popt, pcov = curve_fit(____, x, y)
print(popt)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 3, 5, 7, 9])      # a=2, b=1 のはず
popt, pcov = curve_fit(line, x, y)
print(popt)`,
          test:
            "import numpy as np\n" +
            "assert np.allclose(popt, [2, 1], atol=1e-6), " +
            "f'フィット結果が違います: {popt}'",
          hints: [
            "curve_fit の第1引数は「当てはめるモデル関数」です。",
            "ここで定義した関数 `line` を渡します。",
            "答え: 空欄は `line`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-4-lesson-2-ex-2",
          prompt: "popt から傾き（1番目のパラメータ）を `a_fit` に取り出そう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 3, 5, 7, 9])
popt, pcov = curve_fit(line, x, y)
a_fit = popt[____]
print("傾き =", a_fit)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 3, 5, 7, 9])
popt, pcov = curve_fit(line, x, y)
a_fit = popt[0]
print("傾き =", a_fit)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(a_fit, 2), f'a_fit が違います: {a_fit}'",
          hints: [
            "popt はモデルの引数順、つまり `[a, b]` の並びです。",
            "傾き `a` は最初の要素なので番号 0。",
            "答え: 空欄は `0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L4-3 初期値 p0 を渡す -----
    {
      id: "stage-4-lesson-3",
      title: "初期値 p0 を渡す",
      explanation:
        "非線形なモデルは、出発点（初期値）次第で正しく収束しません。" +
        "`curve_fit(..., p0=[...])` でパラメータの出発点を渡します。" +
        "**p0 の並びはモデル関数の引数順と同じ**です。\n\n" +
        "**研究での出番**: 増光のピーク時刻や幅に「だいたいの当たり」を与えます。",
      exercises: [
        {
          id: "stage-4-lesson-3-ex-1",
          prompt:
            "ガウス型フィットに初期値 `p0` を渡そう（A・mu・sigma のざっくり値）。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)        # 真の値: A=3, mu=1, sigma=0.8
popt, pcov = curve_fit(gauss, x, y, p0=____)
print(popt)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)        # 真の値: A=3, mu=1, sigma=0.8
popt, pcov = curve_fit(gauss, x, y, p0=[2, 0, 1])
print(popt)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(popt[0], 3.0, atol=1e-2), f'A が違います: {popt[0]}'\n" +
            "assert np.isclose(popt[1], 1.0, atol=1e-2), f'mu が違います: {popt[1]}'\n" +
            "assert np.isclose(abs(popt[2]), 0.8, atol=1e-2), f'sigma が違います: {popt[2]}'",
          hints: [
            "p0 は `[A, mu, sigma]` の順のリストです。",
            "真の値を知らない前提で、ざっくり `[2, 0, 1]` のような出発点で十分です。",
            "答え: 空欄は `[2, 0, 1]`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-4-lesson-3-ex-2",
          prompt:
            "p0 の2番目（中心 mu の初期値）を `0.0` にしよう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 5.0, 2.0, 1.2)
popt, pcov = curve_fit(gauss, x, y, p0=[4.0, ____, 1.0])
print(popt)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 5.0, 2.0, 1.2)
popt, pcov = curve_fit(gauss, x, y, p0=[4.0, 0.0, 1.0])
print(popt)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(popt[0], 5.0, atol=1e-2), f'A が違います: {popt[0]}'\n" +
            "assert np.isclose(popt[1], 2.0, atol=1e-2), f'mu が違います: {popt[1]}'",
          hints: [
            "p0 は引数順 `[A, mu, sigma]`。2番目は中心 `mu` の初期値です。",
            "真の中心を知らない前提なら `0.0` から始めれば十分です。",
            "答え: 空欄は `0.0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L4-4 bounds で範囲を制約する -----
    {
      id: "stage-4-lesson-4",
      title: "bounds で範囲を制約する",
      explanation:
        "物理的にあり得ない値（負の幅など）にフィットが落ちないよう、" +
        "`bounds=([下限のリスト], [上限のリスト])` でパラメータの範囲を制約" +
        "できます。制約しない端は `-np.inf` / `np.inf` を置きます。\n\n" +
        "**研究での出番**: 増光の幅や時刻を、物理的に妥当な範囲に閉じ込めます。",
      exercises: [
        {
          id: "stage-4-lesson-4-ex-1",
          prompt:
            "sigma の上限を「無限大」にして、上限側を制約しないようにしよう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)
# sigma は正に保ちたい → 下限 0、上限は制約しない
popt, pcov = curve_fit(
    gauss, x, y, p0=[2, 0, 1],
    bounds=([-np.inf, -np.inf, 0], [np.inf, np.inf, ____]),
)
print(popt)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)
# sigma は正に保ちたい → 下限 0、上限は制約しない
popt, pcov = curve_fit(
    gauss, x, y, p0=[2, 0, 1],
    bounds=([-np.inf, -np.inf, 0], [np.inf, np.inf, np.inf]),
)
print(popt)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(popt[0], 3.0, atol=1e-2), f'A が違います: {popt[0]}'\n" +
            "assert popt[2] > 0, f'sigma が正になっていません: {popt[2]}'",
          hints: [
            "「制約しない上限」は無限大 `np.inf` で表します。",
            "上限リストの3番目（sigma）に `np.inf` を置きます。",
            "答え: 空欄は `np.inf`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-4-lesson-4-ex-2",
          prompt: "振幅 A の上限を `10` に制約しよう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)
# A は 0〜10 の範囲に制約する
popt, pcov = curve_fit(
    gauss, x, y, p0=[2, 0, 1],
    bounds=([0, -np.inf, 0], [____, np.inf, np.inf]),
)
print(popt)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def gauss(x, A, mu, sigma):
    return A * np.exp(-(x - mu)**2 / (2 * sigma**2))

x = np.linspace(-5, 5, 60)
y = gauss(x, 3.0, 1.0, 0.8)
# A は 0〜10 の範囲に制約する
popt, pcov = curve_fit(
    gauss, x, y, p0=[2, 0, 1],
    bounds=([0, -np.inf, 0], [10, np.inf, np.inf]),
)
print(popt)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(popt[0], 3.0, atol=1e-2), f'A が違います: {popt[0]}'\n" +
            "assert 0 <= popt[0] <= 10, f'A が範囲外です: {popt[0]}'",
          hints: [
            "上限リストの1番目（A）に上限値を置きます。",
            "A の上限は `10` です。",
            "答え: 空欄は `10`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L4-5 共分散から誤差を出す -----
    {
      id: "stage-4-lesson-5",
      title: "共分散から誤差を出す",
      explanation:
        "curve_fit の2つ目の戻り値 `pcov` は**共分散行列**です。" +
        "その対角成分の平方根 `np.sqrt(np.diag(pcov))` が、各パラメータの" +
        "推定誤差（1σ）になります。値だけでなく誤差まで出して初めて結果です。\n\n" +
        "**研究での出番**: 「ピーク時刻 = 4522 ± 0.3 日」のように誤差つきで報告します。",
      exercises: [
        {
          id: "stage-4-lesson-5-ex-1",
          prompt: "pcov の対角成分を取り出し、その平方根を `perr` に入れよう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

rng = np.random.default_rng(0)
x = np.linspace(0, 10, 30)
y = 2 * x + 1 + rng.normal(0, 0.5, x.size)
popt, pcov = curve_fit(line, x, y)
perr = np.sqrt(np.____(pcov))
print("傾き =", popt[0], "±", perr[0])`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

rng = np.random.default_rng(0)
x = np.linspace(0, 10, 30)
y = 2 * x + 1 + rng.normal(0, 0.5, x.size)
popt, pcov = curve_fit(line, x, y)
perr = np.sqrt(np.diag(pcov))
print("傾き =", popt[0], "±", perr[0])`,
          test:
            "import numpy as np\n" +
            "assert perr.shape == (2,), f'perr の形が違います: {perr.shape}'\n" +
            "assert np.all(perr > 0), f'誤差が正になっていません: {perr}'\n" +
            "assert np.allclose(perr, np.sqrt(np.diag(pcov))), 'perr の計算が違います'",
          hints: [
            "行列の対角成分を取り出す関数は `np.diag(...)` です。",
            "`np.sqrt(np.diag(pcov))` で各パラメータの 1σ 誤差になります。",
            "答え: 空欄は `diag`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-4-lesson-5-ex-2",
          prompt: "perr から傾きの誤差（1番目）を `a_err` に取り出そう。",
          starterCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

rng = np.random.default_rng(0)
x = np.linspace(0, 10, 30)
y = 2 * x + 1 + rng.normal(0, 0.5, x.size)
popt, pcov = curve_fit(line, x, y)
perr = np.sqrt(np.diag(pcov))
a_err = perr[____]
print("傾きの誤差 =", a_err)`,
          solutionCode: `import numpy as np
from scipy.optimize import curve_fit

def line(x, a, b):
    return a * x + b

rng = np.random.default_rng(0)
x = np.linspace(0, 10, 30)
y = 2 * x + 1 + rng.normal(0, 0.5, x.size)
popt, pcov = curve_fit(line, x, y)
perr = np.sqrt(np.diag(pcov))
a_err = perr[0]
print("傾きの誤差 =", a_err)`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(a_err, perr[0]), f'a_err が違います: {a_err}'\n" +
            "assert a_err > 0, f'誤差が正ではありません: {a_err}'",
          hints: [
            "perr は popt と同じ並び、つまり `[a の誤差, b の誤差]`。",
            "傾き `a` の誤差は最初の要素なので番号 0。",
            "答え: 空欄は `0`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-4-capstone",
    needsDataFile: true,
    blankLevel: "guided",
    prompt:
      "ドロップした `.phot.txt` の増光ピーク付近にガウス型モデルを当てはめ、" +
      "ピーク時刻 `t0` と幅 `sigma` を、誤差つきで求めよう。",
    starterCode: `import numpy as np
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

# 増光ピーク付近（±60日）だけを切り出す
peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y = hjd[near], flux[near]

# ガウス型モデル: c + A*exp(-(t-t0)^2 / (2 sigma^2))
def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

# 初期値（ピーク値・ピーク時刻・幅・ベースライン）
p0 = [130000, peak, 15, 0]
popt, pcov = curve_fit(____, t, y, p0=____)

A_fit, t0_fit, sigma_fit, c_fit = popt
perr = np.sqrt(np.diag(pcov))

print("ピーク時刻 t0 =", round(t0_fit, 3), "±", round(perr[1], 3))
print("増光の幅 sigma =", round(sigma_fit, 3))`,
    solutionCode: `import numpy as np
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y = hjd[near], flux[near]

def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

p0 = [130000, peak, 15, 0]
popt, pcov = curve_fit(model, t, y, p0=p0)

A_fit, t0_fit, sigma_fit, c_fit = popt
perr = np.sqrt(np.diag(pcov))

print("ピーク時刻 t0 =", round(t0_fit, 3), "±", round(perr[1], 3))
print("増光の幅 sigma =", round(sigma_fit, 3))`,
    test: `import numpy as np
from scipy.optimize import curve_fit
_d = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
_h, _f = _d[:, 0], _d[:, 1]
_peak = _h[np.argmax(_f)]
_near = np.abs(_h - _peak) < 60
_t, _y = _h[_near], _f[_near]
def _m(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))
_popt, _ = curve_fit(_m, _t, _y, p0=[130000, _peak, 15, 0])
assert np.allclose(popt, _popt, rtol=1e-3), f"フィット結果が違います: {popt}"
assert 4500 < t0_fit < 4540, f"ピーク時刻が外れています: {t0_fit}"
assert perr[1] > 0, "ピーク時刻の誤差が出ていません"`,
    hints: [
      "curve_fit の第1引数は当てはめるモデル関数 `model` です。",
      "初期値はあらかじめ `p0` に用意してあります。`p0=p0` と渡します。",
      "空欄は順に `model` ／ `p0` です。",
    ],
  },
};
