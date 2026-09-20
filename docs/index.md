- Table of contents
{:toc}

# viteがHTML要素のID属性をハッシュしたCSSセレクタを生成するので困った話

サンプルプロジェクトのソースをGitHubに公開しました。以下のURLからアクセスできます。

-   [kazurayam / how-to-setup-vite-not-to-hash-ID-in-CSS-selector](https://github.com/kazurayam/how-to-setup-vite-not-to-hash-ID-in-CSS-selector)

## はじめに

私はある学術団体のインターネットホームページの管理を任されている。そのサイトは古き良きHTMLサイトであり、ソースの部品化ができていないため、メンテナンスに問題がある。このサイトをTypeScript言語でJSXで書き直したいと念願している。ただしこのサイトは現状ApacheサーバのhtdocsディレクトリにHTMLとCSSとJSを配置するだけのシンプルな構成であり、それを維持したい。スタティックサイトジェネレーター minista を使えば私の望みが叶えられそうだと思った。私がministaに入門した次第をZenn記事で公開した。

-   [スタティックサイトジェネレーター minista を試してみた](https://github.com/kazurayam/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/blob/article/base-project/index.html)

新しいサイトを元サイトと完全に同じ見た目にしたい。それは必須だ。ところが、元サイトをTypeScriptとJSXとCSS Moduleで書き直したら、新しいサイトの見た目が元サイトと全然違ったものになってしまった。元サイトでは有効に働いていたCSSルールが新しいサイトで無効になっていた。原因を調査し対策を講じた。その次第を記録し公開する。

## step01: 元となる静的HTMLサイト

[デモのレポジトリ](https://github.com/kazurayam/how-to-setup-vite-not-to-hash-ID-in-CSS-selector) をローカルにcloneして、VSCodeの [Live Server](https://zenn.dev/harasho/articles/vscode-live-server) extensionを使って `base-project/index.html` を開くと、以下のような静的HTMLサイトが表示されます。

-   <http://127.0.0.1:5500/base-project/index.html>

![base-project/index.html](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/011_base-project-top.png)

-   <http://127.0.0.1:5500/base-project/about/index.html>

![base-project/about/index.html](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/012_base-project-about.png)

このwebサイトは本記事のために作ったサンプルです。わたしが仕事で関わっているサイトを踏まえていますがまったく別物です。平凡なHTMLとCSSと画像から構成されています。

    $ tree base-project
    base-project
    ├── about
    │   └── index.html
    ├── images
    │   ├── 4467417.jpeg
    │   └── seagull.jpg
    ├── index.html
    └── style
        ├── about.css
        ├── general.css
        ├── index.css
        └── layout.css

ソースコードの一部を引用しておきます。

### index.html

    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/svg+xml" href="/favicon.svg">
      <title>base project</title>
      <link rel="stylesheet" href="./style/general.css">
      <link rel="stylesheet" href="./style/layout.css">
      <link rel="stylesheet" href="./style/index.css">
    </head>

    <body>
      <header id="myheader">
        <h1>base project</h1>
      </header>
      <nav id="mynav">
        <ul class="menu">
          <li>
            <a href="/base-project/">Top</a>
          </li>
          <li>
            <a href="/base-project/about/">About</a>
          </li>
          <li>
            <a href="#">News</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
      <main id="main">
        <div class="mainVisual">
          <div class="titleBox">
            <h2>Hello</h2>
          </div>
          <div class="newsBox">
            <h3>News</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.</p>

            <p>Do magna sagittis ad veniam hendrerit commodo est hendrerit velit diam vitae quis occaecat. Quis lorem eu
              cupidatat ad fermentum eros cillum diam culpa mollit eros amet. Do pariatur id aute sed ad sagittis. Aliquet
              exercitation consectetur culpa tristique est esse nulla culpa. Fermentum porta fermentum ea esse dolor.
              Excepteur in nisi occaecat porta duis et adipiscing anim. Laborum proident lorem irure duis labore porta diam
              maecenas exercitation hendrerit eu officia.</p>

            <p>Ea nulla lorem adipiscing eros laborum fugiat magna vivamus. Nulla minim tempor maecenas magna qui pariatur
              labore maecenas lorem vivamus anim. Integer sint veniam anim duis do velit porta dolor vitae cupidatat
              tristique minim. Ex commodo lorem enim vel sit proident. Consectetur non exercitation lorem adipiscing mollit
              faucibus ad pariatur.</p>

          </div>
        </div>
      </main>
      <footer id="myfooter">
        <p>Footer</p>
      </footer>
    </body>

    </html>

### style/general.css

    @charset "UTF-8";

    * {
       margin: 0;
       padding: 0;
       box-sizing: border-box;
    }
    img {
       display: block;
       max-width: 100%;
       height: auto;
    }
    body {
       font-family: "UD Digi Kyokasho N-R", sans-serif;
       line-height: 1.5;
    }

### style/layout.css

    @charset "UTF-8";

    #myheader {
        background-color: deepskyblue;
        color: white;
        text-align: center;
        padding: 10px;
    }

    #mynav {
        background-color:gainsboro;
    }

    #mynav .menu {
      display: flex;
      list-style-type: none;
      margin: 0;
      padding: 0;
      background-color: #333333;
    }

    #mynav .menu li a {
      display: block;
      color: #f1f1f1;
      padding: 14px 16px;
      text-decoration: none;
    }

    #mynav .menu li a:hover {
      background-color: #dddddd;
      color: black;
    }

    #myfooter {
        background-color: #333333;
        padding: 5px;
        text-align: center;
        color:white;
    }

### style/index.css

    @charset "UTF-8";

    #main .mainVisual {
        position: relative;
        padding: 40px 40px 50px 40px;
        width: 100%;
        height: 100%;
    }

    #main .mainVisual::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('../images/seagull.jpg') no-repeat center / cover;
        opacity: 0.3;
    }

    #main .mainVisual .newsBox {
        color: #666;
    }

ここに登場したCSSセレクタに注目してください。

`#main .mainVisual`

これがstep02及びそれ以降で問題となります。

### images/seagull.jpg

![seagull](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/seagull.jpg)

## step02: ページのスタイルが壊れた

[minista](https://minista.qranoko.jp/)を使って新しいプロジェクト `my-minista-project` を作りました。`base-project` のHTMLファイル `index.html` をTypeScript言語でJSX構文を使って書き直した。`base-project` のCSSファイル群を `my-minista-project` にコピーしました。

    $ tree my-minista-project -I node_modules -I dist
    my-minista-project
    ├── bun.lock
    ├── package.json
    ├── public
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src
    │   ├── assets
    │   │   ├── css
    │   │   │   ├── common
    │   │   │   │   ├── general.css
    │   │   │   │   └── layout.css
    │   │   │   └── modules
    │   │   │       ├── about.module.css
    │   │   │       └── index.module.css
    │   │   └── images
    │   │       ├── 4467417.jpeg
    │   │       └── seagull.jpg
    │   ├── layouts
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   ├── index.tsx
    │   │   └── nav.tsx
    │   └── pages
    │       ├── about
    │       │   └── index.tsx
    │       └── index.tsx
    ├── tsconfig.json
    └── vite.config.ts

    11 directories, 18 files

下記の操作をしてviteの開発サーバを立ち上げました。

    $ cd my-minista-project
    $ bun install
    $ bun run dev

ブラウザで `http://localhost:5173` をブラウザで開くと、以下のような画面が表示されました。

![021 style was broken](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/021_style-was-broken.png)

`base-project` とは見た目が違っている。背景画像が無くなっている。余白の大きさが違っています。どうしてこうなったのか？

## step04: viteが .tsx と .css をトランスパイルしてどんなHTMLを生成したのか

ブラウザで `http://localhost:5173` を開いたときにブラウザに表示されたwebページをファイルに保存した。それが下記のテキストです。

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <script type="module" src="my-minista-project_files/client_hfwT.js"></script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/svg+xml" href="http://localhost:5173/favicon.svg">
        <title>my-minista-project</title>
        <script type="module" src="my-minista-project_files/@__minista-bundle-glob_hfwT.js"></script>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/common/general.css">
            @charset "UTF-8";

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            img {
                display: block;
                max-width: 100%;
                height: auto;
            }

            body {
                font-family: "UD Digi Kyokasho N-R'", sans-serif;
                line-height: 1.5;
            }
        </style>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/common/layout.css">
            @charset "UTF-8";

            #myheader {
                background-color: deepskyblue;
                color: white;
                text-align: center;
                padding: 10px;
            }

            #mynav {
                background-color: gainsboro;
            }

            #mynav .menu {
                display: flex;
                list-style-type: none;
                margin: 0;
                padding: 0;
                background-color: #333333;
            }

            #mynav .menu li a {
                display: block;
                color: #f1f1f1;
                padding: 14px 16px;
                text-decoration: none;
            }

            #mynav .menu li a:hover {
                background-color: #dddddd;
                color: black;
            }

            #myfooter {
                background-color: #333333;
                padding: 5px;
                text-align: center;
                color: white;
            }
        </style>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/modules/about.module.css">
            @charset "UTF-8";

            section {
                padding: 40px 20px;
                background-color: #f5f5f5;
            }

            figure {
                float: right;
                margin: 10px 25px 25px 20px;
                width: 30%;
            }

            figure img {
                width: 100%;
            }

            ._clear_yvd9w_15 {
                clear: both;
            }
        </style>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/modules/index.module.css">
            @charset "UTF-8";

            #_main_1rt9u_3 ._mainVisual_1rt9u_3 {
                position: relative;
                padding: 40px 40px 50px 40px;
                width: 100%;
                height: 100%;
            }

            #_main_1rt9u_3 ._mainVisual_1rt9u_3::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('../images/seagull.jpg') no-repeat center / cover;
                opacity: 0.3;
            }

            #_main_1954u_3 ._mainVisual_1954u_3 ._newsBox_1954u_21 {
                color: #666;
            }
        </style>
    </head>

    <body>
        <header id="myheader">
            <h1>my-minista-project</h1>
        </header>
        <nav id="mynav">
            <ul class="menu">
                <li><a href="http://localhost:5173/">Top</a></li>
                <li><a href="http://localhost:5173/about/">About</a></li>
                <li><a href="#">News</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
        <main id="main">
            <div class="_mainVisual_1rt9u_3">
                <div>
                    <h2>Hello</h2>
                </div>
                <div class="_newsBox_1954u_21">
                    <h3>News</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Do magna sagittis ad veniam hendrerit commodo est hendrerit velit diam vitae quis occaecat. Quis
                        lorem eu cupidatat ad fermentum eros cillum diam culpa mollit eros amet. Do pariatur id aute sed ad
                        sagittis. Aliquet exercitation consectetur culpa tristique est esse nulla culpa. Fermentum porta
                        fermentum ea esse dolor. Excepteur in nisi occaecat porta duis et adipiscing anim. Laborum proident
                        lorem irure duis labore porta diam maecenas exercitation hendrerit eu officia.</p>
                    <p>Ea nulla lorem adipiscing eros laborum fugiat magna vivamus. Nulla minim tempor maecenas magna qui
                        pariatur labore maecenas lorem vivamus anim. Integer sint veniam anim duis do velit porta dolor
                        vitae cupidatat tristique minim. Ex commodo lorem enim vel sit proident. Consectetur non
                        exercitation lorem adipiscing mollit faucibus ad pariatur.</p>
                </div>
            </div>
        </main>
        <footer id="myfooter">
            <p>Footer</p>
        </footer>
    </body>

    </html>

背景画像が表示されなくなった原因は何か？

109行目あたりに次のようなCSSルールがインラインで埋め込まれています。

            #_main_1rt9u_3 ._mainVisual_1rt9u_3::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('../images/seagull.jpg') no-repeat center / cover;
                opacity: 0.3;
            }

このCSSセレクタ `#_main_1rt9u_3 ._mainVisual_1rt9u_3` は間違っています。このCSSセレクタに対応するHTML要素が138行目あたりにあります。

        <main id="main">
            <div class="_mainVisual_1rt9u_3">

このHTMLに整合するCSSセレクタは `#main ._mainVisual_1rt9u_3` です。このHTML要素は `my-minista-project/src/pages/index.tsx` の 7行目に書かれていたコードに基づいてviteが生成したものです。

        <main id={styles.main}>
          <div className={styles.mainVisual}>

viteが `bun run dev` コマンドを契機として `my-minista-project/src/assets/modules/index.css` をトランスパイルして生成したCSSセレクタの中で、HTML要素のID属性がハッシュされてしまったために、CSSセレクタとHTML要素の整合性が崩れてしまったのです。

この問題をどう解決するか?

GitHubレポジトリの [starting-point](https://github.com/kazurayam/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/releases/tag/starting-point) をcheckoutすればここまでの説明を再現できます。

## step04: 解決ステージ１ .tsxでid={styles.main}と書け

`my-minista-project/src/pages/index.tsx` を書きかえた。

      export default function () {
        return (
    -     <main id="main">
    *     <main id={styles.main}>
            <div className={styles.mainVisual}>
              <div className={styles.titleBox}>
                <h2>Hello</h2>

コマンドラインで `bun run dev` して開発サーバを立ち上げ、ブラウザで <http://localhost:5173> を目視した。

するとスタイルが直っていた! たったこれだけ。

![041 resolved](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/041_resolved.png)

CSS Moduleはクラス名をハッシュ化する。そのようにドキュメントに書かれている。そのように説明しているweb記事も多い。
ところがviteのCSS Moduleはクラス名だけでなくID名もハッシュ化の対象としてしまうようだ。そんなことを書いているドキュメントは見当たらない。しかし上記の実地検証によってID名もハッシュ化してしまう。

あるAIに質問してみたらこんな答えが返ってきた。

> Vite の CSS Modules はデフォルトでクラス名や ID をハッシュ化しますが、
> これは vite.config.js の css.modules.generateScopedName を設定することでカスタマイズできます。
>
> CSS Modules は基本的に クラス名 をスコープ化対象としますが、
> \#idName のような ID セレクタも書けます。
> ただし、generateScopedName を変更しない限り、ID もハッシュ化されます。

AIが提供した詳細な情報を下記にメモした。

-   <https://github.com/aogan-office/aomori-gankaikai-HP/issues/151> (privateレポジトリなので閲覧制限あり)

とはいえ、AIによるワザにふけるよりも、.tsxで `id={styles.ID名}` と書けばそれで済むのだから、そっちの方が楽だ。

## 結論

ministaの基盤である \[vite\](<https://ja.vite.dev/>) がSelectorを書き替えたCSSを主力するのだが、class名をhash化するだけでなくIDまでもhash化した。その一方でページのテンプレートの方ではHTML要素のIDがhashされることを想定していなかった。合成された `<style>` のなかのSelectorがHTML DOMの実体と不整合になってしまった。

不整合を回避するには、.tsvの中で `<div className={styles.mainVisual}>` と書いたのと同じノリで `<main id={styles.main}`&gt; のようにハッシュ化されたID名を採用するにコーディングすればいいだけだった。

わかってしまえばどおってことない。
