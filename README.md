# How to setup vite not to hash ID in CSS selector

古き良きHTMLサイトをTypeScript言語でJSXで書き直したいと思った。LayoutとページテンプレートをTypeScript言語でJSX構文で書いて、[minista](https://minista.qranoko.jp/) ver4を使って静的サイトを生成した。

やってみたら画面のスタイルが崩れた。ministaの基盤である [vite](https://ja.vite.dev/) がSelectorを書き替えたCSSを主力するのだが、class名をhash化するだけでなくIDまでもhash化した。その一方でページのテンプレートの方ではHTML要素のIDがhashされることを想定していなかった。合成された `<style>` のなかのSelectorがHTML DOMの実体と不整合になってしまった。SelectorとDOMの不整合を解消する方法をAIが教えてくれた。viteがID要素をhash化しないように `vite.config.ts` を設定した。

古き良きHTMLサイトをJSXで書き直したいと考える人がもしいたら、わたしと同じように四苦八苦するだろう。彼らのためにわたしの経験を記録して公開しよう。

- [docs](https://kazurayam.github.io/how-to-setup-vite-not-to-hash-ID-in-CSS-selector/)
