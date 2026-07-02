import type { StaticImageData } from "next/image"

import cursorLogo from "./logos/cursor.svg"
import dubLogo from "./logos/dub.svg"
import githubLogo from "./logos/github.svg"
import linearLogo from "./logos/linear.svg"
import notionLogo from "./logos/notion.svg"
import openaiLogo from "./logos/openai.svg"
import vercelLogo from "./logos/vercel.svg"

export type LogoCloudLogo = {
  name: string
  src: StaticImageData | string
}

export const LOGO_CLOUD_LOGOS: LogoCloudLogo[] = [
  { name: "Cursor", src: cursorLogo },
  { name: "Dub", src: dubLogo },
  { name: "GitHub", src: githubLogo },
  { name: "Linear", src: linearLogo },
  { name: "Notion", src: notionLogo },
  { name: "OpenAI", src: openaiLogo },
  { name: "Vercel", src: vercelLogo },
]

export const LOGO_CLOUD_CELL_COUNT = 4

export function getLogoSrc(src: StaticImageData | string): string {
  return typeof src === "string" ? src : src.src
}
