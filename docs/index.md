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

このwebサイトは本記事のために作ったサンプルです。わたしが仕事で関わっているサイトのコードを踏まえていますが、どおってことないHTMLとCSSと画像から構成されています。

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

ここに登場したCSSセレクタに注目してください。

`#main .mainVisual`

これがstep02及びそれ以降で問題となります。

### images/seagull.jpg

![seagull](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/seagull.jpg)

## step02: ページのスタイルが壊れた

[minista](https://minista.qranoko.jp/)を使って新しいプロジェクト `my-minista-project` を作りました。`base-project` のHTMLファイル `index.html` をTypeScript言語でJSX構文を使って書き直しました。`base-project` のCSSファイル群を `my-minista-project` にコピーしました。

下記の操作をしてviteの開発サーバを立ち上げました。

    $ cd my-minista-project
    $ bun install
    $ bun run dev

ブラウザで `http://localhost:5173` をブラウザで開くと、以下のようにが画面が表示されました。

![021 style was broken](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/images/021_style-was-broken.png)

元サイト `base-project` とは見た目が違っています。背景画像が無くなっていますし、余白の大きさが違っています。どうしてこうなったのか？これが解決すべき問題です。

## step04: viteが .tsx と .css をトランスパイルしてどんなHTMLを生成したのか

ブラウザで `http://localhost:5173` を開いたときにブラウザに表示されたwebページをファイルに保存し増田。それが下記のテキストです。

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <script type="module" src="my-minista-project_files/client_My4J.js"></script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/svg+xml" href="http://localhost:5173/favicon.svg">
        <title>my-minista-project</title>
        <script type="module" src="my-minista-project_files/@__minista-bundle-glob_My4J.js"></script>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/common/general.css">
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
        </style>
        <style type="text/css"
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/common/layout.css">
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
            data-vite-dev-id="/Users/kazuakiurayama/github/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/my-minista-project/src/assets/css/modules/index.module.css">
            #_main_1clvc_2 ._mainVisual_1clvc_2 {
                position: relative;
                padding: 40px 40px 50px 40px;
                width: 100%;
                height: 100%;
                background: url('/src/assets/images/seagull.jpg') no-repeat center / cover;
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
            <div class="mainVisual">
                <div class="titleBox">
                    <h2>Hello</h2>
                </div>
                <div class="newsBox">
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

このHTMLはviteのdevelopment serverが生成したものです。
