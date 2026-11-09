import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Project } from '../content'

const WIDTH = 1280
const HEIGHT = 800

function drawBase(context: CanvasRenderingContext2D) {
  const background = context.createLinearGradient(0, 0, WIDTH, HEIGHT)
  background.addColorStop(0, '#1d1409')
  background.addColorStop(1, '#09090d')
  context.fillStyle = background
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const glow = context.createRadialGradient(WIDTH * 0.28, HEIGHT * 0.22, 0, WIDTH * 0.28, HEIGHT * 0.22, WIDTH * 0.6)
  glow.addColorStop(0, 'rgba(245, 165, 36, 0.32)')
  glow.addColorStop(1, 'rgba(245, 165, 36, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const scale = Math.max(WIDTH / image.width, HEIGHT / image.height)
  const w = image.width * scale
  const h = image.height * scale
  context.drawImage(image, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h)
  // darken the bottom so the label stays readable on any screenshot
  const shade = context.createLinearGradient(0, HEIGHT * 0.45, 0, HEIGHT)
  shade.addColorStop(0, 'rgba(7, 7, 10, 0)')
  shade.addColorStop(1, 'rgba(7, 7, 10, 0.85)')
  context.fillStyle = shade
  context.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawLabel(context: CanvasRenderingContext2D, project: Project, index: number, withNumber: boolean) {
  if (withNumber) {
    context.font = '700 420px "Space Grotesk"'
    context.lineWidth = 3
    context.strokeStyle = 'rgba(255, 207, 122, 0.45)'
    context.textBaseline = 'alphabetic'
    context.strokeText(String(index + 1).padStart(2, '0'), 64, HEIGHT * 0.62)
  }

  context.fillStyle = 'rgba(255, 207, 122, 0.9)'
  context.font = '400 26px "JetBrains Mono"'
  context.fillText(`${project.year}  ·  ${project.role}`.toUpperCase(), 72, HEIGHT - 150)

  context.fillStyle = '#f3efe6'
  context.font = '700 76px "Space Grotesk"'
  context.fillText(project.title, 68, HEIGHT - 70)
}

// The card face: the project screenshot when there is one, otherwise a
// gold-on-black title card. Images load in the background and swap in.
export function createProjectTexture(project: Project, index: number) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4

  if (!context) {
    return texture
  }

  drawBase(context)
  drawLabel(context, project, index, true)

  if (project.image) {
    const image = new Image()
    image.onload = () => {
      drawBase(context)
      drawCover(context, image)
      drawLabel(context, project, index, false)
      texture.needsUpdate = true
    }
    image.src = project.image
  }

  return texture
}
