// 段0「Python の基礎」。真の初心者の助走。numpy は使わず、研究の解析で
// 実際に出てくる最小限の Python だけを短く学ぶ。スキーマは docs/DATA_MODEL.md。

/** @type {object} Stage */
export const stage0 = {
  id: "stage-0",
  number: 0,
  title: "Python の基礎 — 変数・list・関数",
  intro:
    "プログラミングがはじめての人のための助走です。研究の解析で実際に使う" +
    "最小限の Python ―― 変数・計算・文字列・リスト・くりかえし・関数 ―― " +
    "だけを、短く学びます。",
  status: "active",
  lessons: [
    // ----- L0-1 変数と数の計算 -----
    {
      id: "stage-0-lesson-1",
      title: "変数と数の計算",
      explanation:
        "変数は、値に名前をつけた箱です。`=` で値を入れます（代入）。" +
        "数の計算は `+` `-` `*` `/`、`**` はべき乗です。\n\n" +
        "**研究での出番**: 観測値や定数に名前をつけ、式で計算します。",
      exercises: [
        {
          id: "stage-0-lesson-1-ex-1",
          prompt:
            "観測した等級 `mag` と補正値 `offset` を足して `corrected` に入れよう。",
          starterCode: `mag = 18.5
offset = 0.25

corrected = ____
print(corrected)`,
          solutionCode: `mag = 18.5
offset = 0.25

corrected = mag + offset
print(corrected)`,
          test: "assert corrected == 18.75, f'corrected が違います: {corrected}'",
          hints: [
            "変数どうしは `+` で足せます。",
            "`mag + offset` の結果を `corrected` に入れます。",
            "答え: `corrected = mag + offset`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-0-lesson-1-ex-2",
          prompt:
            "口径 `d` の望遠鏡の半径（`d / 2`）の2乗を `light` に入れよう（`**` を使う）。",
          starterCode: `d = 8

light = (d / 2) ** ____
print(light)`,
          solutionCode: `d = 8

light = (d / 2) ** 2
print(light)`,
          test: "assert light == 16.0, f'light が違います: {light}'",
          hints: [
            "「2乗」はべき乗 `**` で書きます。",
            "`(d / 2) ** 2` で半径の2乗になります。",
            "答え: 空欄は `2`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L0-2 文字列とprint -----
    {
      id: "stage-0-lesson-2",
      title: "文字列と print",
      explanation:
        "文字列は `\" \"` で囲んだ文字の並びです。`+` でつなげられます。" +
        "`f\"...{変数}...\"` の形（f文字列）を使うと、文字列の中に変数の値を" +
        "埋め込めます。`print()` は結果を画面に表示します。\n\n" +
        "**研究での出番**: 計算結果にラベルをつけて見やすく表示します。",
      exercises: [
        {
          id: "stage-0-lesson-2-ex-1",
          prompt:
            "天体名 `name` と等級 `mag` を埋め込んで、`label` に1文を作ろう（f文字列）。",
          starterCode: `name = "MOA-2024-BLG-001"
mag = 18.5

label = f"天体 {____} の等級は {____}"
print(label)`,
          solutionCode: `name = "MOA-2024-BLG-001"
mag = 18.5

label = f"天体 {name} の等級は {mag}"
print(label)`,
          test:
            'assert label == "天体 MOA-2024-BLG-001 の等級は 18.5", f"label が違います: {label}"',
          hints: [
            "f文字列の `{ }` の中に変数名を書くと、その値に置き換わります。",
            "1つ目の `{ }` に `name`、2つ目に `mag` を入れます。",
            "答え: `{name}` と `{mag}`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-0-lesson-2-ex-2",
          prompt:
            "接頭辞 `prefix` と番号 `num` をつなげて、観測ID `obs_id` を作ろう。",
          starterCode: `prefix = "OBS-"
num = "0042"

obs_id = ____
print(obs_id)`,
          solutionCode: `prefix = "OBS-"
num = "0042"

obs_id = prefix + num
print(obs_id)`,
          test: 'assert obs_id == "OBS-0042", f"obs_id が違います: {obs_id}"',
          hints: [
            "文字列どうしも `+` でつなげられます。",
            "`prefix + num` でつながります。",
            "答え: `obs_id = prefix + num`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L0-3 リスト -----
    {
      id: "stage-0-lesson-3",
      title: "リスト",
      explanation:
        "リストは、値を順番に並べたものです。`[ ]` で作ります。番号は 0 から" +
        "始まり、`lst[0]` で要素を取り出します。`len(lst)` で個数、" +
        "`lst.append(x)` で末尾に追加できます。\n\n" +
        "**研究での出番**: 複数の観測値をまとめて持ちます（numpy 配列の前段階）。",
      exercises: [
        {
          id: "stage-0-lesson-3-ex-1",
          prompt:
            "等級のリスト `mags` の最初の値を `first`、個数を `count` に入れよう。",
          starterCode: `mags = [18.2, 18.0, 17.9, 18.1]

first = mags[____]
count = len(____)
print(first, count)`,
          solutionCode: `mags = [18.2, 18.0, 17.9, 18.1]

first = mags[0]
count = len(mags)
print(first, count)`,
          test:
            "assert first == 18.2, f'first が違います: {first}'\n" +
            "assert count == 4, f'count が違います: {count}'",
          hints: [
            "リストの最初の要素は番号 0 です: `mags[0]`。",
            "個数は `len(mags)` で数えます。",
            "答え: `mags[0]` ／ `len(mags)`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-0-lesson-3-ex-2",
          prompt: "リスト `mags` の末尾に、新しい観測値 18.3 を追加しよう。",
          starterCode: `mags = [18.2, 18.0]

mags.____(18.3)
print(mags)`,
          solutionCode: `mags = [18.2, 18.0]

mags.append(18.3)
print(mags)`,
          test: "assert mags == [18.2, 18.0, 18.3], f'mags が違います: {mags}'",
          hints: [
            "リストの末尾への追加は `.append(...)` です。",
            "`mags.append(18.3)` と書きます。",
            "答え: 空欄は `append`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L0-4 for と if -----
    {
      id: "stage-0-lesson-4",
      title: "for と if",
      explanation:
        "`for x in リスト:` は、リストの要素を1つずつ取り出してくり返します。" +
        "`if 条件:` は条件が成り立つときだけ実行します。どちらも、続く行を" +
        "**インデント（字下げ）**してブロックを表します。\n\n" +
        "**研究での出番**: 全観測点を1つずつ調べたり、条件で選り分けたりします。",
      exercises: [
        {
          id: "stage-0-lesson-4-ex-1",
          prompt:
            "リスト `mags` の合計を、for で1つずつ足して `total` に求めよう。",
          starterCode: `mags = [18.2, 18.0, 17.9, 18.1]

total = 0
for m in mags:
    total = total + ____
print(total)`,
          solutionCode: `mags = [18.2, 18.0, 17.9, 18.1]

total = 0
for m in mags:
    total = total + m
print(total)`,
          test: "assert abs(total - 72.2) < 1e-9, f'total が違います: {total}'",
          hints: [
            "`for m in mags:` の中で、`m` がそのときの要素です。",
            "`total` に `m` を足し込みます。",
            "答え: `total = total + m`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-0-lesson-4-ex-2",
          prompt:
            "18.0 より明るい（値が小さい）観測点の数を `bright` に数えよう。",
          starterCode: `mags = [18.2, 17.9, 18.1, 17.8, 18.3]

bright = 0
for m in mags:
    if m < ____:
        bright = bright + 1
print(bright)`,
          solutionCode: `mags = [18.2, 17.9, 18.1, 17.8, 18.3]

bright = 0
for m in mags:
    if m < 18.0:
        bright = bright + 1
print(bright)`,
          test: "assert bright == 2, f'bright が違います: {bright}'",
          hints: [
            "「18.0 より明るい」は「値が 18.0 より小さい」です。",
            "`if m < 18.0:` と書きます。",
            "答え: 空欄は `18.0`",
          ],
          blankLevel: "guided",
        },
      ],
    },

    // ----- L0-5 関数 -----
    {
      id: "stage-0-lesson-5",
      title: "関数",
      explanation:
        "関数は、処理に名前をつけて何度でも使えるようにしたものです。" +
        "`def 名前(引数):` で定義し、`return` で結果を返します。\n\n" +
        "**研究での出番**: 同じ計算をくり返すとき、1つにまとめて使い回します。",
      exercises: [
        {
          id: "stage-0-lesson-5-ex-1",
          prompt:
            "等級を受け取り、補正値 0.1 を引いて返す関数 `correct` を完成させよう。",
          starterCode: `def correct(mag):
    return mag - ____

print(correct(18.5))`,
          solutionCode: `def correct(mag):
    return mag - 0.1

print(correct(18.5))`,
          test:
            "assert abs(correct(18.5) - 18.4) < 1e-9, 'correct(18.5) が違います'\n" +
            "assert abs(correct(20.0) - 19.9) < 1e-9, 'correct(20.0) が違います'",
          hints: [
            "`return` の右に「引数 mag から 0.1 を引いた式」を書きます。",
            "`return mag - 0.1` です。",
            "答え: 空欄は `0.1`",
          ],
          blankLevel: "guided",
        },
        {
          id: "stage-0-lesson-5-ex-2",
          prompt: "2つの数の平均を返す関数 `mean2` を完成させよう。",
          starterCode: `def mean2(a, b):
    return (a + b) / ____

print(mean2(18.0, 19.0))`,
          solutionCode: `def mean2(a, b):
    return (a + b) / 2

print(mean2(18.0, 19.0))`,
          test:
            "assert mean2(18.0, 19.0) == 18.5, 'mean2(18.0, 19.0) が違います'\n" +
            "assert mean2(10, 20) == 15.0, 'mean2(10, 20) が違います'",
          hints: [
            "平均は「合計 ÷ 個数」。2つの数なので 2 で割ります。",
            "`(a + b) / 2` です。",
            "答え: 空欄は `2`",
          ],
          blankLevel: "guided",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-0-capstone",
    blankLevel: "guided",
    prompt:
      "総まとめ。等級のリストから、(1) 平均、(2) 18.0 より明るい点の数 を" +
      "求めよう。for・if・len をすべて使う。",
    starterCode: `mags = [18.2, 17.9, 18.1, 17.8, 18.3, 18.0]

# (1) 平均を求める
total = 0
for m in mags:
    total = total + ____
average = total / len(mags)

# (2) 18.0 より明るい点を数える
bright = 0
for m in mags:
    if ____:
        bright = bright + 1

print("平均:", average)
print("明るい点:", bright)`,
    solutionCode: `mags = [18.2, 17.9, 18.1, 17.8, 18.3, 18.0]

# (1) 平均を求める
total = 0
for m in mags:
    total = total + m
average = total / len(mags)

# (2) 18.0 より明るい点を数える
bright = 0
for m in mags:
    if m < 18.0:
        bright = bright + 1

print("平均:", average)
print("明るい点:", bright)`,
    test: `assert abs(average - sum(mags) / len(mags)) < 1e-9, f"平均が違います: {average}"
assert bright == sum(1 for m in mags if m < 18.0), f"明るい点の数が違います: {bright}"`,
    hints: [
      "平均: for の中で `total` に `m` を足し込みます。",
      "明るい点: `if m < 18.0:` で数えます。",
      "空欄は順に `m` ／ `m < 18.0` です。",
    ],
  },
};
