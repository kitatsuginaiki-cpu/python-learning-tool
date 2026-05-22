// 段6「MCMC」。emcee でパラメータの確率分布をサンプリングし、
// 推定値と誤差を求め、corner plot で相関を見る。
// emcee / corner は Pyodide 同梱外 → packages 経由で micropip インストールされる。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage6 = {
  id: "stage-6",
  number: 6,
  title: "MCMC — emcee と corner plot",
  intro:
    "curve_fit は1組の最適値しか返しません。MCMC は、パラメータの" +
    "「確率分布」そのものをサンプリングして調べる手法です。emcee で分布を" +
    "サンプリングし、誤差を percentile で出し、corner plot で相関を見ます。",
  status: "active",
  packages: ["scipy", "matplotlib", "emcee", "corner"],
  lessons: [
    // ----- L6-1 対数確率を定義する -----
    {
      id: "stage-6-lesson-1",
      title: "対数確率を定義する",
      explanation:
        "MCMC は「そのパラメータがどれだけもっともらしいか」を**対数確率" +
        "（log probability）**で表し、その分布をサンプリングします。良い" +
        "フィットほど χ² が小さいので、最も簡単には `log_prob = -0.5 * χ²` " +
        "とします（確率が高い＝値が大きい＝χ² が小さい）。\n\n" +
        "**研究での出番**: 増光モデルの「当てはまり具合」を確率として書きます。",
      exercises: [
        {
          id: "stage-6-lesson-1-ex-1",
          prompt: "χ² から対数確率を返すよう、空欄を埋めよう。",
          starterCode: `import numpy as np

def log_prob(theta, x, y, err):
    model = theta[0] * x + theta[1]
    chi2 = np.sum(((y - model) / err)**2)
    return -0.5 * ____

x   = np.array([0.0, 1.0, 2.0])
y   = np.array([1.0, 3.0, 5.0])
err = np.array([1.0, 1.0, 1.0])
print(log_prob(np.array([2.0, 2.0]), x, y, err))   # ピッタリでないので負`,
          solutionCode: `import numpy as np

def log_prob(theta, x, y, err):
    model = theta[0] * x + theta[1]
    chi2 = np.sum(((y - model) / err)**2)
    return -0.5 * chi2

x   = np.array([0.0, 1.0, 2.0])
y   = np.array([1.0, 3.0, 5.0])
err = np.array([1.0, 1.0, 1.0])
print(log_prob(np.array([2.0, 2.0]), x, y, err))   # ピッタリでないので負`,
          test:
            "import numpy as np\n" +
            "assert log_prob(np.array([2.0, 1.0]), x, y, err) == 0.0, " +
            "'完全一致なら 0 になるはずです'\n" +
            "assert np.isclose(log_prob(np.array([2.0, 2.0]), x, y, err), -1.5), " +
            "f'対数確率が違います: {log_prob(np.array([2.0, 2.0]), x, y, err)}'",
          hints: [
            "対数確率は χ² に `-0.5` を掛けたものです。",
            "`return -0.5 * chi2` と書きます。",
            "答え: 空欄は `chi2`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-6-lesson-1-ex-2",
          prompt:
            "原点に近いほど確率が高い 2次元ガウスの対数確率を完成させよう。",
          starterCode: `import numpy as np

def log_prob(theta):
    # theta = [x, y]。原点で最大（= 0.0）になる
    return -0.5 * np.sum(theta**____)

print(log_prob(np.array([0.0, 0.0])))   # 原点 → 0.0
print(log_prob(np.array([1.0, 0.0])))   # 少し外れ → -0.5`,
          solutionCode: `import numpy as np

def log_prob(theta):
    # theta = [x, y]。原点で最大（= 0.0）になる
    return -0.5 * np.sum(theta**2)

print(log_prob(np.array([0.0, 0.0])))   # 原点 → 0.0
print(log_prob(np.array([1.0, 0.0])))   # 少し外れ → -0.5`,
          test:
            "import numpy as np\n" +
            "assert log_prob(np.array([0.0, 0.0])) == 0.0, '原点で 0 になるはずです'\n" +
            "assert log_prob(np.array([1.0, 0.0])) == -0.5, " +
            "f'対数確率が違います: {log_prob(np.array([1.0, 0.0]))}'",
          hints: [
            "ガウスの肩には「二乗」が乗ります。",
            "`np.sum(theta**2)` と書きます。",
            "答え: 空欄は `2`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L6-2 サンプラーを準備する -----
    {
      id: "stage-6-lesson-2",
      title: "サンプラーを準備する",
      explanation:
        "emcee は `import emcee` で読み込みます。" +
        "`emcee.EnsembleSampler(walker数, パラメータ数, log_prob)` で" +
        "サンプラーを作ります。**walker** は分布を探索する複数の「歩き手」で、" +
        "互いに情報をやり取りしながら確率分布を埋めていきます。\n\n" +
        "**研究での出番**: パラメータ空間を多数の walker で並行に探索します。",
      exercises: [
        {
          id: "stage-6-lesson-2-ex-1",
          prompt: "EnsembleSampler を作って `sampler` に入れよう。",
          starterCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

ndim = 2
nwalkers = 8
sampler = emcee.____(nwalkers, ndim, log_prob)
print(sampler)`,
          solutionCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

ndim = 2
nwalkers = 8
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
print(sampler)`,
          test:
            "import emcee\n" +
            "assert isinstance(sampler, emcee.EnsembleSampler), " +
            "'sampler が EnsembleSampler ではありません'",
          hints: [
            "emcee のサンプラークラスは `EnsembleSampler` です。",
            "`emcee.EnsembleSampler(nwalkers, ndim, log_prob)` と書きます。",
            "答え: 空欄は `EnsembleSampler`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-6-lesson-2-ex-2",
          prompt:
            "各 walker の初期位置 `p0` を、(walker数, パラメータ数) の乱数で作ろう。",
          starterCode: `import numpy as np

np.random.seed(0)
ndim = 2
nwalkers = 8
# 形が (nwalkers, ndim) の乱数 = 各 walker の出発点
p0 = np.random.randn(nwalkers, ____)
print(p0.shape)`,
          solutionCode: `import numpy as np

np.random.seed(0)
ndim = 2
nwalkers = 8
# 形が (nwalkers, ndim) の乱数 = 各 walker の出発点
p0 = np.random.randn(nwalkers, ndim)
print(p0.shape)`,
          test:
            "assert p0.shape == (8, 2), f'p0 の形が違います: {p0.shape}'",
          hints: [
            "初期位置の形は (walker数, パラメータ数)。2つ目はパラメータ数です。",
            "`np.random.randn(nwalkers, ndim)` と書きます。",
            "答え: 空欄は `ndim`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L6-3 MCMCを走らせる -----
    {
      id: "stage-6-lesson-3",
      title: "MCMCを走らせる",
      explanation:
        "`sampler.run_mcmc(初期位置, ステップ数)` で MCMC を走らせます。" +
        "各 walker が指定したステップ数だけ動きます。実行後 " +
        "`sampler.get_chain()` で**(ステップ数, walker数, パラメータ数)**の" +
        "形をした全記録（チェイン）が得られます。\n\n" +
        "**研究での出番**: 分布を埋めるのに十分なステップ数を走らせます。",
      exercises: [
        {
          id: "stage-6-lesson-3-ex-1",
          prompt: "MCMC を `nsteps` ステップ走らせよう。",
          starterCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers, nsteps = 2, 8, 100
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, ____, progress=False)
chain = sampler.get_chain()
print("チェインの形:", chain.shape)`,
          solutionCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers, nsteps = 2, 8, 100
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, nsteps, progress=False)
chain = sampler.get_chain()
print("チェインの形:", chain.shape)`,
          test:
            "assert chain.shape == (100, 8, 2), f'チェインの形が違います: {chain.shape}'",
          hints: [
            "`run_mcmc` の2番目の引数はステップ数です。",
            "ステップ数は `nsteps` という名前で用意されています。",
            "答え: 空欄は `nsteps`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-6-lesson-3-ex-2",
          prompt:
            "チェインの形 (ステップ数, walker数, パラメータ数) から、ステップ数を取り出そう。",
          starterCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)
chain = sampler.get_chain()
nsteps_done = chain.shape[____]
print("走ったステップ数:", nsteps_done)`,
          solutionCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)
chain = sampler.get_chain()
nsteps_done = chain.shape[0]
print("走ったステップ数:", nsteps_done)`,
          test:
            "assert nsteps_done == 100, f'ステップ数が違います: {nsteps_done}'",
          hints: [
            "形は (ステップ数, walker数, パラメータ数)。ステップ数は先頭です。",
            "先頭の要素は番号 0。",
            "答え: 空欄は `0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L6-4 バーンインを捨ててサンプルを集める -----
    {
      id: "stage-6-lesson-4",
      title: "バーンインを捨ててサンプルを集める",
      explanation:
        "MCMC の序盤は初期位置の影響が残った「バーンイン」期間で、分布を" +
        "正しく表しません。`get_chain(discard=捨てる数, flat=True)` で序盤を" +
        "捨て、全 walker を1本に**平坦化**したサンプル集合を得ます。" +
        "平坦化後の形は (残ステップ × walker数, パラメータ数) です。\n\n" +
        "**研究での出番**: 信頼できる部分だけを取り出して統計に使います。",
      exercises: [
        {
          id: "stage-6-lesson-4-ex-1",
          prompt: "全 walker を1本に平坦化したサンプルを取り出そう。",
          starterCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)

flat = sampler.get_chain(discard=30, flat=____)
print("平坦化後の形:", flat.shape)`,
          solutionCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)

flat = sampler.get_chain(discard=30, flat=True)
print("平坦化後の形:", flat.shape)`,
          test:
            "assert flat.shape == (560, 2), f'平坦化後の形が違います: {flat.shape}'",
          hints: [
            "全 walker を1本にまとめるには `flat=True` を渡します。",
            "`get_chain(discard=30, flat=True)` です。",
            "答え: 空欄は `True`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-6-lesson-4-ex-2",
          prompt: "序盤の 30 ステップをバーンインとして捨てよう。",
          starterCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)

# 100 ステップ中、最初の 30 を捨てる
flat = sampler.get_chain(discard=____, flat=True)
print("平坦化後の形:", flat.shape)`,
          solutionCode: `import numpy as np
import emcee

def log_prob(theta):
    return -0.5 * np.sum(theta**2)

np.random.seed(0)
ndim, nwalkers = 2, 8
p0 = np.random.randn(nwalkers, ndim)
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 100, progress=False)

# 100 ステップ中、最初の 30 を捨てる
flat = sampler.get_chain(discard=30, flat=True)
print("平坦化後の形:", flat.shape)`,
          test:
            "assert flat.shape == (560, 2), f'平坦化後の形が違います: {flat.shape}'",
          hints: [
            "`discard=` に捨てるステップ数を渡します。",
            "捨てるのは最初の 30 ステップです。",
            "答え: 空欄は `30`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L6-5 パーセンタイルで推定値と誤差 -----
    {
      id: "stage-6-lesson-5",
      title: "パーセンタイルで推定値と誤差",
      explanation:
        "平坦化サンプルの各パラメータ列に `np.percentile` を使い、" +
        "**50%（中央値）を推定値**、**16% と 84% の差を ±1σ 誤差**とします" +
        "（正規分布の ±1σ がちょうど 16〜84% に対応）。これで「値 ± 誤差」が" +
        "出ます。\n\n" +
        "**研究での出番**: MCMC の結果を「t0 = 4521.7 +0.3 / -0.3」の形で報告します。",
      exercises: [
        {
          id: "stage-6-lesson-5-ex-1",
          prompt: "16・50・84 パーセンタイルを取り出そう。",
          starterCode: `import numpy as np

np.random.seed(0)
# あるパラメータの MCMC サンプル
samples = np.random.normal(5.0, 2.0, 50000)
p16, p50, p84 = np.percentile(samples, [16, 50, ____])
print("推定値（中央値）=", round(p50, 2))`,
          solutionCode: `import numpy as np

np.random.seed(0)
# あるパラメータの MCMC サンプル
samples = np.random.normal(5.0, 2.0, 50000)
p16, p50, p84 = np.percentile(samples, [16, 50, 84])
print("推定値（中央値）=", round(p50, 2))`,
          test:
            "import numpy as np\n" +
            "assert abs(p50 - 5.0) < 0.2, f'中央値が想定とずれています: {p50}'\n" +
            "assert p16 < p50 < p84, 'パーセンタイルの大小関係がおかしいです'",
          hints: [
            "1σ 上側は 84 パーセンタイルです。",
            "`np.percentile(samples, [16, 50, 84])` と書きます。",
            "答え: 空欄は `84`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-6-lesson-5-ex-2",
          prompt: "中央値からの下側 1σ 誤差 `err_minus` を求めよう。",
          starterCode: `import numpy as np

np.random.seed(0)
samples = np.random.normal(5.0, 2.0, 50000)
p16, p50, p84 = np.percentile(samples, [16, 50, 84])

err_plus  = p84 - p50
err_minus = p50 - ____
print("推定値 =", round(p50, 2),
      "+", round(err_plus, 2), "/ -", round(err_minus, 2))`,
          solutionCode: `import numpy as np

np.random.seed(0)
samples = np.random.normal(5.0, 2.0, 50000)
p16, p50, p84 = np.percentile(samples, [16, 50, 84])

err_plus  = p84 - p50
err_minus = p50 - p16
print("推定値 =", round(p50, 2),
      "+", round(err_plus, 2), "/ -", round(err_minus, 2))`,
          test:
            "import numpy as np\n" +
            "assert np.isclose(err_minus, p50 - p16), f'err_minus が違います: {err_minus}'\n" +
            "assert err_minus > 0, '誤差が正になっていません'",
          hints: [
            "下側の誤差は「中央値 − 16パーセンタイル」です。",
            "`p50 - p16` と書きます。",
            "答え: 空欄は `p16`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-6-capstone",
    needsDataFile: true,
    blankLevel: "guided",
    prompt:
      "ドロップした `.phot.txt` の増光にガウス型モデルを MCMC で当てはめ、" +
      "ピーク時刻 `t0` を誤差つきで推定し、corner plot を描こう。",
    starterCode: `import numpy as np
import emcee
import corner
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

# 増光ピーク付近（±60日）を切り出す
peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y, e = hjd[near], flux[near], err[near]

def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

# curve_fit で出発点を作る
start, _ = curve_fit(model, t, y, p0=[130000, peak, 15, 0])

# 対数確率: -0.5 * χ²（sigma<=0 は物理的にあり得ないので除外）
def log_prob(theta):
    A, t0, sigma, c = theta
    if sigma <= 0:
        return -np.inf
    resid = y - model(t, A, t0, sigma, c)
    return -0.5 * np.sum((resid / ____)**2)

# walker を curve_fit の解の周りの小さな塊に配置
np.random.seed(0)
ndim, nwalkers = 4, 16
p0 = start + 1e-4 * np.abs(start) * np.random.randn(nwalkers, ndim)

sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 400, progress=False)

# バーンイン 100 を捨てて平坦化
flat = sampler.get_chain(discard=100, flat=____)

# t0（2番目のパラメータ）の推定値と誤差
p16, p50, p84 = np.percentile(flat[:, 1], [16, 50, 84])
print("ピーク時刻 t0 =", round(p50, 3),
      "+", round(p84 - p50, 3), "/ -", round(p50 - p16, 3))

# corner plot で4パラメータの分布と相関を描く
corner.corner(flat, labels=["A", "t0", "sigma", "c"])`,
    solutionCode: `import numpy as np
import emcee
import corner
from scipy.optimize import curve_fit

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd, flux, err = data[:, 0], data[:, 1], data[:, 2]

peak = hjd[np.argmax(flux)]
near = np.abs(hjd - peak) < 60
t, y, e = hjd[near], flux[near], err[near]

def model(t, A, t0, sigma, c):
    return c + A * np.exp(-(t - t0)**2 / (2 * sigma**2))

start, _ = curve_fit(model, t, y, p0=[130000, peak, 15, 0])

def log_prob(theta):
    A, t0, sigma, c = theta
    if sigma <= 0:
        return -np.inf
    resid = y - model(t, A, t0, sigma, c)
    return -0.5 * np.sum((resid / e)**2)

np.random.seed(0)
ndim, nwalkers = 4, 16
p0 = start + 1e-4 * np.abs(start) * np.random.randn(nwalkers, ndim)

sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 400, progress=False)

flat = sampler.get_chain(discard=100, flat=True)

p16, p50, p84 = np.percentile(flat[:, 1], [16, 50, 84])
print("ピーク時刻 t0 =", round(p50, 3),
      "+", round(p84 - p50, 3), "/ -", round(p50 - p16, 3))

corner.corner(flat, labels=["A", "t0", "sigma", "c"])`,
    test: `import numpy as np
import matplotlib.pyplot as plt
assert flat.shape[1] == 4, f"サンプルの列数が違います: {flat.shape}"
assert flat.shape[0] == (400 - 100) * 16, f"平坦化サンプル数が違います: {flat.shape[0]}"
assert p16 < p50 < p84, "パーセンタイルの大小関係がおかしいです"
assert 4500 < p50 < 4540, f"ピーク時刻の推定が外れています: {p50}"
assert len(plt.get_fignums()) >= 1, "corner plot が描かれていません"`,
    hints: [
      "対数確率の χ² は「残差 ÷ 誤差」の二乗和。誤差は `e` という名前です。",
      "サンプルは全 walker を平坦化するので `flat=True`。",
      "空欄は順に `e` ／ `True` です。",
    ],
  },
};
