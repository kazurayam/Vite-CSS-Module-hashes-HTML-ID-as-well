- Table of contents
{:toc}

# viteがHTML要素のID属性をハッシュしたCSSセレクタを生成するのを回避する方法

## はじめに

私はある学術団体のインターネットホームページの管理を任されている。そのサイトは古き良きHTMLサイトであり、ソースの部品化ができていないため、メンテナンスに問題がある。このサイトをTypeScript言語でJSXで書き直したいと念願している。ただしこのサイトは現状ApacheサーバのhtdocsディレクトリにHTMLとCSSとJSを配置するだけのシンプルな構成であり、それを維持したい。スタティックサイトジェネレーター minista を使えば私の望みが叶えられそうだと思った。私がministaに入門した次第をZenn記事で公開した。

-   スタティックサイトジェネレーター minista を試してみた

新しいサイトを元サイトと完全に同じ見た目にしたい。それが必須の目標だ。ところが、元サイトをTypeScriptとJSCとCSS Moduleで書き直すと、新しいサイトの見た目が元サイトと全然違ったものになってしまった。原因調査と対策の次第を記録し公開する。

## step01: 元となる静的HTMLサイト

<https://github.com/kazurayam/how-to-setup-vite-not-to-hash-ID-in-selector/blob/article/base-project/index.html> をブラウザで開くと、以下のような静的HTMLサイトが表示されます。

![step01: 元となる静的HTMLサイト](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-selector/images/011_base-project.png)

どおってことないwebサイトです。HTMLとCSSと画像から構成されています。

    $ tree base-project
    base-project
    ├── images
    │   └── seagull.jpg
    ├── index.html
    └── style
        ├── general.css
        ├── index.css
        └── layout.css

ソースコードを掲載しておきます。

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
            <a href="/">Top</a>
          </li>
          <li>
            <a href="/about/">About</a>
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

    /* style/general.css */
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

### style/layout.css

    /* style/layout.css */
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

    /* style/index.css */
    #main .mainVisual {
        position: relative;
      padding: 40px 40px 50px 40px;
        width: 100%;
        height: 100%;
        background: url('../images/seagull.jpg') no-repeat center / cover;
    }
    /*
    #main .mainVisual .titleBox {
      padding: 0 0 40px 0;
    }
    #main .mainVisual .newsBox h3{
      padding: 0 0 20px 0;
    }
      */

### images/seagull.jpg

![seagull](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-selector/images/seagull.jpg)
