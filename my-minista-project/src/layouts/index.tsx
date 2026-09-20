// src/layouts/index.tsx
import type { LayoutProps } from "minista/types"
import { Head } from "minista/head"

import { MyHeader } from "./header"
import { MyNav } from "./nav"
import { MyFooter} from "./footer"

import "/src/assets/css/common/general.css"
import "/src/assets/css/common/layout.css"

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