import { JetBrains_Mono as FontMono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { absoluteUrl } from './utils'

export const fontSans = GeistSans

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export async function getFonts() {
  const [bold, regular] = await Promise.all([
    fetch(new URL(absoluteUrl('/fonts/Geist-Bold.ttf'), import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),

    fetch(
      new URL(absoluteUrl('/fonts/Geist-Regular.ttf'), import.meta.url)
    ).then((res) => res.arrayBuffer()),
  ])

  return {
    bold,
    regular,
  }
}
