// src/pages/index.tsx

import styles from "/src/assets/css/modules/index.module.css"

export default function () {
  return (
    <main id="main">
    <div className={styles.mainVisual}>
      <div className={styles.titleBox}>
        <h2>Hello</h2>
      </div>
      <div className="{styles.newsBox}">
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
  )
}
