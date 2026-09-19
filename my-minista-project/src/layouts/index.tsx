// src/layouts/index.tsx
import type { LayoutProps } from "minista/types"
import { Head } from "minista/head"

import { MyHeader } from "./header"
import { MyNav } from "./nav"
import { MyFooter} from "./footer"

import "/src/assets/css/general.css"
import "/src/assets/css/layout.css"
import "/src/assets/css/index.module.css"

export default function (props: LayoutProps) {
  return (
    <>
      <Head htmlAttributes={{ lang: "en" }}>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>my-minista-project</title>
      </Head>
      <MyHeader />
      <MyNav />
      {props.children}
      <MyFooter />
    </>
  )
}