import fontUrl from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff?url'
import type { Font } from 'opentype.js'

export type Assets = {
  font: Font
}

let assets: Promise<Assets> | null = null

async function loadLatin() {
  const [{ parse }, response] = await Promise.all([import('opentype.js'), fetch(fontUrl)])
  return parse(await response.arrayBuffer())
}

// The 3D scene is its own chunk so the page text can paint before three.js arrives.
export const loadExperience = () => import('../experience/Experience')

export const loadCarousel = () => import('../experience/Carousel')

let canvasFonts: Promise<unknown> | null = null

// Project cards are drawn on a canvas, which needs the web fonts loaded first.
export function loadCanvasFonts() {
  canvasFonts ??= Promise.all([
    document.fonts.load('700 64px "Space Grotesk"'),
    document.fonts.load('400 24px "JetBrains Mono"'),
  ])
  return canvasFonts
}

// Shared by the loader (to know when to reveal) and the scene (via React `use`).
export function loadAssets() {
  assets ??= Promise.all([loadLatin(), loadExperience()]).then(([font]) => ({ font }))
  return assets
}
