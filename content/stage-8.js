// 段8「実環境を整える力」。最終段＝卒業段。読み物＋選択式クイズ形式。
// MOA セッションの median_abs_deviation（古い scipy）問題を教材化する。
// スキーマは docs/DATA_MODEL.md を参照。

/** @type {object} Stage */
export const stage8 = {
  id: "stage-8",
  number: 8,
  title: "実環境を整える力 — venv・pip・版数",
  intro:
    "最終段です。PyLadder はこれまで「環境」を肩代わりしてきました。" +
    "でも本物の研究マシンでは、自分で環境を整え、詰まったら自分で直す" +
    "必要があります。卒業段では、その力を読み物とクイズで身につけます。",
  status: "active",
  lessons: [
    // ----- L8-1 なぜ環境で詰まるのか -----
    {
      id: "stage-8-lesson-1",
      title: "なぜ環境で詰まるのか",
      explanation:
        "PyLadder はブラウザ内の Pyodide で「環境」を丸ごと肩代わりして" +
        "きました。だからあなたは一度も `pip` も `venv` も触らずに段6まで" +
        "来られたのです。\n\n" +
        "でも、本物の研究マシンやリモートサーバではそうはいきません。" +
        "MOA の解析セッションで実際に詰まったのは Python の文法ではなく" +
        "**環境**でした――リモート Jupyter の scipy が古い、ローカルに pip も" +
        "numpy も無い、など。\n\n" +
        "この卒業段のねらいは「環境を自分で整え、詰まったら自分で直す」力。" +
        "ツールの外に出ても歩けるようにするための、最後の段です。",
      exercises: [
        {
          id: "stage-8-lesson-1-ex-1",
          kind: "quiz",
          prompt:
            "PyLadder で `pip` も `venv` も触らずに段6まで進めたのは、なぜですか？",
          choices: [
            "ブラウザ内の Pyodide が環境を丸ごと肩代わりしていたから",
            "Python には「環境」という概念がそもそも無いから",
            "段6まではコードを一切書いていないから",
          ],
          answer: 0,
          explain:
            "Pyodide が numpy/scipy などを最初から持っているため、環境構築を" +
            "意識せずに済みました。実環境ではこの部分を自分で用意します。",
        },
        {
          id: "stage-8-lesson-1-ex-2",
          kind: "quiz",
          prompt:
            "研究で「詰まる」原因として、このツールが最優先で対策してきたのは？",
          choices: [
            "Python の文法そのものの難しさ",
            "実行環境（パッケージの有無・版数など）のトラブル",
            "キーボード入力の速さ",
          ],
          answer: 1,
          explain:
            "文法より環境で詰まる――それが MOA セッションの教訓でした。" +
            "だから PyLadder は「環境で詰まらないこと」を最優先要件にしています。",
        },
      ],
    },

    // ----- L8-2 pip でパッケージを入れる -----
    {
      id: "stage-8-lesson-2",
      title: "pip でパッケージを入れる",
      explanation:
        "Python の標準ライブラリに無い機能（numpy・scipy・pandas など）は、" +
        "**外部パッケージ**として配布されています。`pip` は、それを " +
        "**PyPI**（Python Package Index）からダウンロードして入れるツールです。\n\n" +
        "ターミナルで `pip install numpy` のように使います。" +
        "もし `import numpy` が `ModuleNotFoundError` になったら――" +
        "まず「そのパッケージが入っているか」を疑い、入っていなければ " +
        "`pip install` する、というのが最初の一手です。",
      exercises: [
        {
          id: "stage-8-lesson-2-ex-1",
          kind: "quiz",
          prompt:
            "`import pandas` で `ModuleNotFoundError: No module named 'pandas'` " +
            "が出ました。最初にすべきことは？",
          choices: [
            "`pip install pandas` で pandas を入れる",
            "パソコンを再起動する",
            "`import` を `import2` に書き換える",
          ],
          answer: 0,
          explain:
            "`ModuleNotFoundError` は「そのパッケージが入っていない」という" +
            "意味。`pip install pandas` で入れれば import できるようになります。",
        },
        {
          id: "stage-8-lesson-2-ex-2",
          kind: "quiz",
          prompt: "`pip` がパッケージをダウンロードしてくる場所は、どこですか？",
          choices: [
            "GitHub の好きなリポジトリ",
            "PyPI（Python Package Index）という公式の配布サイト",
            "自分のパソコンの別のフォルダ",
          ],
          answer: 1,
          explain:
            "pip は標準では PyPI から取得します。段6で emcee を入れた " +
            "micropip も、ブラウザ版の pip として PyPI を見に行っていました。",
        },
      ],
    },

    // ----- L8-3 仮想環境 venv -----
    {
      id: "stage-8-lesson-3",
      title: "仮想環境 venv",
      explanation:
        "プロジェクトごとに、必要なパッケージや版数は違います。すべてを1つの " +
        "Python にまとめて入れると、あるプロジェクトが要求する版数が別の" +
        "プロジェクトを壊す――**依存の衝突**が起こります。\n\n" +
        "**venv** は「プロジェクト専用の、隔離された Python 環境」を作る" +
        "仕組みです。`python -m venv .venv` で作り、有効化してから " +
        "`pip install` すると、パッケージはその環境の中だけに入ります。\n\n" +
        "研究プロジェクトごとに venv を分ける――これが事故を防ぐ基本作法です。",
      exercises: [
        {
          id: "stage-8-lesson-3-ex-1",
          kind: "quiz",
          prompt: "venv（仮想環境）を使う目的は何ですか？",
          choices: [
            "Python の実行を高速化するため",
            "プロジェクトごとにパッケージを隔離し、版数の衝突を防ぐため",
            "インターネット接続を不要にするため",
          ],
          answer: 1,
          explain:
            "venv はプロジェクトを隔離する仕組み。片方のプロジェクトで版数を" +
            "上げても、別のプロジェクトの環境には影響しません。",
        },
        {
          id: "stage-8-lesson-3-ex-2",
          kind: "quiz",
          prompt: "新しい研究プロジェクトを始めるとき、推奨される進め方は？",
          choices: [
            "そのプロジェクト専用の venv を作ってからパッケージを入れる",
            "すべてのプロジェクトで1つの Python を共用する",
            "プロジェクトのたびに Python 本体を入れ直す",
          ],
          answer: 0,
          explain:
            "「プロジェクト＝1つの venv」が基本。最初に venv を作る習慣を" +
            "つけると、後から依存の衝突に悩まされにくくなります。",
        },
      ],
    },

    // ----- L8-4 パッケージの版数 -----
    {
      id: "stage-8-lesson-4",
      title: "パッケージの版数",
      explanation:
        "パッケージは更新され続け、関数が増えたり名前が変わったりします。" +
        "**版数（バージョン）**が違えば、使える機能も違います。\n\n" +
        "MOA セッションの実例: `scipy.stats.median_abs_deviation` は " +
        "scipy 1.5 で追加された関数です。リモート Jupyter の scipy がそれ" +
        "より古かったため、`ImportError` になりました。**「コードは正しいのに" +
        "動かない」ときは、まず版数を疑います。**\n\n" +
        "入っている版数は `pip show scipy`、あるいはコードからは " +
        "`scipy.__version__` で確認できます。対処は `pip install --upgrade` で" +
        "上げるか、上げられない環境なら古い版数でも動く書き方に直すことです。",
      exercises: [
        {
          id: "stage-8-lesson-4-ex-1",
          kind: "quiz",
          prompt:
            "コードは公式ドキュメント通りなのに、ある関数で `ImportError` や " +
            "`AttributeError` が出ます。最も疑うべき原因は？",
          choices: [
            "その関数が、入っているパッケージの版数にはまだ無い（版数が古い）",
            "Python 本体が壊れている",
            "関数名は飾りなので気にしなくてよい",
          ],
          answer: 0,
          explain:
            "ドキュメント通りなのに動かない――典型的な版数違いのサインです。" +
            "ドキュメントは最新版基準で書かれていることが多いので要注意。",
        },
        {
          id: "stage-8-lesson-4-ex-2",
          kind: "quiz",
          prompt: "いま入っている scipy の版数を確認する方法は？",
          choices: [
            "scipy のファイルの拡張子を見る",
            "`pip show scipy`、またはコードで `scipy.__version__`",
            "scipy フォルダの容量を見る",
          ],
          answer: 1,
          explain:
            "`pip show` はターミナルから、`__version__` はコードから確認" +
            "できます。エラーが出たらまず版数を見る癖をつけましょう。",
        },
      ],
    },

    // ----- L8-5 エラーから環境問題を見抜く -----
    {
      id: "stage-8-lesson-5",
      title: "エラーから環境問題を見抜く",
      explanation:
        "エラーメッセージは、環境問題を見抜く最良のヒントです。" +
        "**型**を読み分けられると、原因の場所がすぐ分かります。\n\n" +
        "- `ModuleNotFoundError: No module named 'X'`\n" +
        "  → X が入っていない → `pip install X`\n" +
        "- `ImportError: cannot import name 'Y' from 'X'`\n" +
        "  → X はあるが Y が無い → 版数が古い/新しいのズレ\n" +
        "- `AttributeError: module 'X' has no attribute 'Z'`\n" +
        "  → 同上。版数違いの可能性が大きい\n\n" +
        "慌てて検索する前に、まずエラーの「型」を読む。型が原因の場所を" +
        "教えてくれます（全段共通のエラー読解スキルの総まとめです）。",
      exercises: [
        {
          id: "stage-8-lesson-5-ex-1",
          kind: "quiz",
          prompt:
            "`ModuleNotFoundError: No module named 'emcee'` が伝えているのは？",
          choices: [
            "emcee というパッケージが、この環境に入っていない",
            "emcee のコードの中にバグがある",
            "emcee は使ってはいけないパッケージだ",
          ],
          answer: 0,
          explain:
            "`ModuleNotFoundError` は「モジュールが見つからない＝入っていない」。" +
            "対処は `pip install emcee` です。",
        },
        {
          id: "stage-8-lesson-5-ex-2",
          kind: "quiz",
          prompt:
            "scipy は入っているのに `ImportError: cannot import name " +
            "'median_abs_deviation' from 'scipy.stats'` が出ました。何が" +
            "起きていますか？",
          choices: [
            "scipy が完全に壊れている",
            "scipy はあるが、その版数には median_abs_deviation がまだ無い",
            "import の綴りが必ず間違っている",
          ],
          answer: 1,
          explain:
            "「X はあるが名前 Y が import できない」＝版数違いの典型。" +
            "median_abs_deviation は scipy 1.5 以降にしかありません。",
        },
      ],
    },
  ],
  capstone: {
    id: "stage-8-capstone",
    kind: "quiz",
    needsDataFile: false,
    prompt:
      "リモートの Jupyter で解析中、`from scipy.stats import median_abs_deviation` " +
      "が `ImportError: cannot import name 'median_abs_deviation'` になりました。" +
      "`scipy.__version__` は `1.4.1`（この関数は 1.5 で追加）。サーバの scipy は" +
      "自分では更新できません。最も妥当な対処は？",
    choices: [
      "古い scipy でも動く代替に書き換える（例: numpy で MAD を自分で計算する）",
      "median_abs_deviation という名前を別の綴りに変えてみる",
      "解析そのものをあきらめる",
    ],
    answer: 0,
    explain:
      "エラーは「scipy はあるが版数が古く、その関数が無い」と言っています。" +
      "更新できないサーバなら、古い環境でも動く形に直すのが正解です――" +
      "中央値は `np.median`、MAD は `np.median(np.abs(x - np.median(x)))` で" +
      "自前計算できます（段1で学んだ通り）。環境を読み、制約の中で解く。" +
      "これが研究を最後までやり切る力です。\n\n" +
      "🎓 段8クリア、そして段0〜8の到達ラダー全段制覇おめでとうございます。" +
      "あなたはもう、環境で詰まっても自分で抜け出せます。",
  },
};
