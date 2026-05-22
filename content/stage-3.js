// 段3「matplotlib」。観測データをグラフに描く。
// matplotlib は起動時に読まれないため packages: ["matplotlib"] で遅延ロードする。
// 採点は assert で plt.gca()（現在の Axes）の中身を調べる。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage3 = {
  id: "stage-3",
  number: 3,
  title: "matplotlib — グラフと残差を描く",
  intro:
    "matplotlib は、数値をグラフにするライブラリです。観測データを" +
    "光度曲線として描き、軸ラベルや誤差棒を付け、残差を確認する" +
    "――解析結果を「目で見て確かめる」作業を学びます。",
  status: "active",
  packages: ["matplotlib"],
  lessons: [
    // ----- L3-1 折れ線グラフ -----
    {
      id: "stage-3-lesson-1",
      title: "折れ線グラフを描く",
      explanation:
        "matplotlib は `import matplotlib.pyplot as plt` として読み込みます。" +
        "`plt.plot(x, y)` で、x と y を結んだ折れ線が描けます。実行すると" +
        "結果の下にグラフが表示されます。\n\n" +
        "**研究での出番**: 時刻に対する明るさの変化（光度曲線）を描きます。",
      exercises: [
        {
          id: "stage-3-lesson-1-ex-1",
          prompt: "`x` と `y` を結ぶ折れ線を描こう。",
          starterCode: `import matplotlib.pyplot as plt

x = [0, 1, 2, 3, 4]
y = [0, 1, 4, 9, 16]
plt.____(x, y)`,
          solutionCode: `import matplotlib.pyplot as plt

x = [0, 1, 2, 3, 4]
y = [0, 1, 4, 9, 16]
plt.plot(x, y)`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert len(ax.lines) >= 1, '線が描かれていません'\n" +
            "assert list(ax.lines[0].get_ydata()) == [0, 1, 4, 9, 16], " +
            "f'y データが違います: {list(ax.lines[0].get_ydata())}'",
          hints: [
            "折れ線を描く関数は `plt.plot(...)` です。",
            "`plt.plot(x, y)` と書きます。",
            "答え: 空欄は `plot`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-3-lesson-1-ex-2",
          prompt: "時刻 `hjd` を横軸、等級 `mag` を縦軸にして折れ線を描こう。",
          starterCode: `import matplotlib.pyplot as plt

hjd = [1, 2, 3, 4]
mag = [18.0, 17.5, 17.8, 18.1]
plt.plot(hjd, ____)`,
          solutionCode: `import matplotlib.pyplot as plt

hjd = [1, 2, 3, 4]
mag = [18.0, 17.5, 17.8, 18.1]
plt.plot(hjd, mag)`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert len(ax.lines) >= 1, '線が描かれていません'\n" +
            "assert list(ax.lines[0].get_ydata()) == [18.0, 17.5, 17.8, 18.1], " +
            "f'縦軸のデータが違います: {list(ax.lines[0].get_ydata())}'",
          hints: [
            "`plt.plot(横軸, 縦軸)` の順で渡します。",
            "縦軸には等級 `mag` を渡します。",
            "答え: 空欄は `mag`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L3-2 軸ラベルとタイトル -----
    {
      id: "stage-3-lesson-2",
      title: "軸ラベルとタイトルを付ける",
      explanation:
        "グラフは「何の軸か」が分からないと読めません。`plt.xlabel(\"...\")` " +
        "で横軸、`plt.ylabel(\"...\")` で縦軸、`plt.title(\"...\")` で図の" +
        "見出しを付けます。\n\n" +
        "**研究での出番**: 図を見た人（自分や指導教員）が一目で読めるようにします。",
      exercises: [
        {
          id: "stage-3-lesson-2-ex-1",
          prompt: "横軸ラベルを `\"HJD\"` にしよう（縦軸は記入済み）。",
          starterCode: `import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [18.0, 17.5, 18.1])
plt.____("HJD")
plt.ylabel("magnitude")`,
          solutionCode: `import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [18.0, 17.5, 18.1])
plt.xlabel("HJD")
plt.ylabel("magnitude")`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert ax.get_xlabel() == 'HJD', f'横軸ラベルが違います: {ax.get_xlabel()!r}'\n" +
            "assert ax.get_ylabel() == 'magnitude', f'縦軸ラベルが違います: {ax.get_ylabel()!r}'",
          hints: [
            "横軸のラベルを付ける関数は `plt.xlabel(...)` です。",
            "`plt.xlabel(\"HJD\")` と書きます。",
            "答え: 空欄は `xlabel`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-3-lesson-2-ex-2",
          prompt: "図のタイトルを `\"light curve\"` にしよう。",
          starterCode: `import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [18.0, 17.5, 18.1])
plt.title(____)`,
          solutionCode: `import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [18.0, 17.5, 18.1])
plt.title("light curve")`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert ax.get_title() == 'light curve', " +
            "f'タイトルが違います: {ax.get_title()!r}'",
          hints: [
            "タイトルには文字列を渡します。文字列は `\"` で囲みます。",
            "`plt.title(\"light curve\")` と書きます。",
            "答え: 空欄は `\"light curve\"`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L3-3 散布図と誤差棒 -----
    {
      id: "stage-3-lesson-3",
      title: "散布図と誤差棒",
      explanation:
        "観測点は線でつながず「点」で打つのが基本です。`plt.scatter(x, y)` " +
        "で散布図、`plt.errorbar(x, y, yerr=誤差, fmt=\".\")` で誤差棒つきの" +
        "点が描けます。`fmt=\".\"` は「点で描く」指定です。\n\n" +
        "**研究での出番**: 測定値とその誤差を、点と縦棒で正直に示します。",
      exercises: [
        {
          id: "stage-3-lesson-3-ex-1",
          prompt: "`x` と `y` を散布図（点）で描こう。",
          starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [18.2, 18.0, 17.9, 18.1]
plt.____(x, y)`,
          solutionCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [18.2, 18.0, 17.9, 18.1]
plt.scatter(x, y)`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert len(ax.collections) >= 1, '散布図が描かれていません'",
          hints: [
            "点で描く関数は `plt.scatter(...)` です。",
            "`plt.scatter(x, y)` と書きます。",
            "答え: 空欄は `scatter`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-3-lesson-3-ex-2",
          prompt: "各点に誤差 `err` の縦棒を付けて描こう（`yerr` に渡す）。",
          starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [18.2, 18.0, 17.9, 18.1]
err = [0.05, 0.08, 0.06, 0.10]
plt.errorbar(x, y, yerr=____, fmt=".")`,
          solutionCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [18.2, 18.0, 17.9, 18.1]
err = [0.05, 0.08, 0.06, 0.10]
plt.errorbar(x, y, yerr=err, fmt=".")`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert len(ax.containers) >= 1, '誤差棒が描かれていません'",
          hints: [
            "縦の誤差棒は `yerr=` に誤差の配列を渡します。",
            "ここでは誤差は `err` という名前で用意されています。",
            "答え: 空欄は `err`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L3-4 複数の線と凡例 -----
    {
      id: "stage-3-lesson-4",
      title: "複数の線と凡例",
      explanation:
        "`plt.plot` を続けて呼ぶと、同じ図に線が重なって描かれます。" +
        "各 `plot` に `label=\"...\"` を付け、最後に `plt.legend()` を呼ぶと、" +
        "どの線が何かを示す凡例が出ます。\n\n" +
        "**研究での出番**: 観測データとフィットモデルを重ねて見比べます。",
      exercises: [
        {
          id: "stage-3-lesson-4-ex-1",
          prompt:
            "2本目の線のラベルを `\"model\"` にしよう（1本目は記入済み）。",
          starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
plt.plot(x, [1, 2, 3, 4], label="data")
plt.plot(x, [1, 1, 1, 1], label=____)
plt.legend()`,
          solutionCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
plt.plot(x, [1, 2, 3, 4], label="data")
plt.plot(x, [1, 1, 1, 1], label="model")
plt.legend()`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "leg = ax.get_legend()\n" +
            "assert leg is not None, '凡例がありません'\n" +
            "labels = [t.get_text() for t in leg.get_texts()]\n" +
            "assert 'model' in labels, f'2本目のラベルが違います: {labels}'",
          hints: [
            "ラベルは文字列です。`\"` で囲みます。",
            "2本目のラベルは `\"model\"` にします。",
            "答え: 空欄は `\"model\"`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-3-lesson-4-ex-2",
          prompt: "凡例を表示しよう。",
          starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
plt.plot(x, [1, 2, 3, 4], label="data")
plt.plot(x, [2, 2, 2, 2], label="model")
plt.____()`,
          solutionCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
plt.plot(x, [1, 2, 3, 4], label="data")
plt.plot(x, [2, 2, 2, 2], label="model")
plt.legend()`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert ax.get_legend() is not None, '凡例が表示されていません'",
          hints: [
            "凡例を出す関数は `plt.legend()` です。",
            "引数なしで `plt.legend()` と呼びます。",
            "答え: 空欄は `legend`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L3-5 残差プロットと等級軸 -----
    {
      id: "stage-3-lesson-5",
      title: "残差プロットと等級軸",
      explanation:
        "残差（観測 − モデル）を散布図にし、`plt.axhline(0)` でゼロの基準線を" +
        "引くと、ずれが見やすくなります。また等級は「小さいほど明るい」ため、" +
        "`plt.gca().invert_yaxis()` で縦軸を上下反転させるのが天文の慣習です。\n\n" +
        "**研究での出番**: フィットの良し悪しを残差で判断し、光度曲線を正しい向きで描きます。",
      exercises: [
        {
          id: "stage-3-lesson-5-ex-1",
          prompt: "残差の散布図に、y=0 の基準線を引こう。",
          starterCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
resid = [0.1, -0.05, 0.02, -0.08]
plt.scatter(x, resid)
plt.____(0, color="gray")`,
          solutionCode: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
resid = [0.1, -0.05, 0.02, -0.08]
plt.scatter(x, resid)
plt.axhline(0, color="gray")`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "assert len(ax.collections) >= 1, '残差の散布図がありません'\n" +
            "ys = [set(ln.get_ydata()) for ln in ax.lines]\n" +
            "assert any(y == {0} for y in ys), 'y=0 の基準線がありません'",
          hints: [
            "横方向の基準線を引く関数は `plt.axhline(y)` です。",
            "`plt.axhline(0, color=\"gray\")` と書きます。",
            "答え: 空欄は `axhline`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-3-lesson-5-ex-2",
          prompt: "等級の光度曲線を、縦軸を上下反転して描こう。",
          starterCode: `import matplotlib.pyplot as plt

hjd = [1, 2, 3, 4]
mag = [18.2, 17.0, 17.5, 18.1]
plt.plot(hjd, mag)
plt.gca().____()`,
          solutionCode: `import matplotlib.pyplot as plt

hjd = [1, 2, 3, 4]
mag = [18.2, 17.0, 17.5, 18.1]
plt.plot(hjd, mag)
plt.gca().invert_yaxis()`,
          test:
            "import matplotlib.pyplot as plt\n" +
            "ax = plt.gca()\n" +
            "lo, hi = ax.get_ylim()\n" +
            "assert lo > hi, '縦軸が反転していません（等級は上下反転が慣習）'",
          hints: [
            "縦軸を反転するメソッドは `invert_yaxis()` です。",
            "`plt.gca().invert_yaxis()` と書きます。",
            "答え: 空欄は `invert_yaxis`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-3-capstone",
    needsDataFile: true,
    blankLevel: "guided",
    prompt:
      "ドロップした `.phot.txt` を読み込み、時刻に対するフラックスの" +
      "光度曲線を、誤差棒つきで描こう。横軸ラベルも付けること。",
    starterCode: `import numpy as np
import matplotlib.pyplot as plt

# .phot.txt の 1〜3列目（時刻・フラックス・誤差）を読み込む
data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd  = data[:, 0]
flux = data[:, 1]
err  = data[:, 2]

# 誤差棒つきの光度曲線を描く
plt.errorbar(hjd, flux, yerr=____, fmt=".", ms=3)
plt.xlabel(____)
plt.ylabel("flux")
plt.title("light curve")

print("測定点:", hjd.shape[0])`,
    solutionCode: `import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
hjd  = data[:, 0]
flux = data[:, 1]
err  = data[:, 2]

plt.errorbar(hjd, flux, yerr=err, fmt=".", ms=3)
plt.xlabel("HJD")
plt.ylabel("flux")
plt.title("light curve")

print("測定点:", hjd.shape[0])`,
    test: `import numpy as np
import matplotlib.pyplot as plt
_d = np.loadtxt("/data.phot.txt", usecols=(0, 1, 2))
ax = plt.gca()
assert len(ax.containers) >= 1, "誤差棒つきのプロットがありません"
assert ax.get_xlabel().strip() != "", "横軸ラベルがありません"
assert ax.get_ylabel().strip() != "", "縦軸ラベルがありません"
assert hjd.shape[0] == _d.shape[0], f"読み込んだ点数が違います: {hjd.shape[0]}"`,
    hints: [
      "誤差棒の大きさは `yerr=` に誤差の配列 `err` を渡します。",
      "横軸は時刻なので `plt.xlabel(\"HJD\")` とします。",
      "空欄は順に `err` ／ `\"HJD\"` です。",
    ],
  },
};
