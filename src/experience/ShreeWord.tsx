import { useFrame } from '@react-three/fiber'
import { use, useEffect, useMemo, useRef } from 'react'
import { MeshPhysicalMaterial, type Mesh } from 'three'
import { profile } from '../content'
import { loadAssets } from '../lib/assets'
import { createGlyphs } from '../lib/glyphGeometry'
import { lerp } from '../lib/math'
import { useAppStore } from '../store/useAppStore'
import { stagger, timeline, wordY } from './timeline'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const TRACKING = 0.08

type Spot = { x: number; y: number; z: number; rx: number; ry: number; rz: number }

type Piece = {
  char: string
  // position in the word, or -1 for letters that drift away
  slot: number
  // order among the letters that drift away
  order: number
  wide: Spot
  tall: Spot
}

// Small seeded random generator so the letter field looks the same on every visit.
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Field = {
  cols: number
  rows: number
  top: number
  bottom: number
  blocked: (x: number, y: number) => boolean
  seed: number
}

// Spreads the letters over a jittered grid (fractions of the half viewport),
// skipping cells that would sit under the nav or the hero copy.
function layoutField(count: number, { cols, rows, top, bottom, blocked, seed }: Field) {
  const rand = random(seed)
  const cells: { x: number; y: number }[] = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = -0.9 + ((col + 0.5) / cols) * 1.8
      const y = top - ((row + 0.5) / rows) * (top - bottom)
      if (!blocked(x, y)) {
        cells.push({ x, y })
      }
    }
  }
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[cells[i], cells[j]] = [cells[j], cells[i]]
  }

  const jitterX = (0.5 / cols) * 1.8
  const jitterY = (0.4 / rows) * (top - bottom)
  return Array.from({ length: count }, (_, index): Spot => {
    const cell = cells[index % cells.length]
    return {
      x: cell.x + (rand() - 0.5) * jitterX,
      y: cell.y + (rand() - 0.5) * jitterY,
      z: -1 + rand() * 1.2,
      rx: (rand() - 0.5) * 0.6,
      ry: (rand() - 0.5) * 0.8,
      rz: (rand() - 0.5) * 0.5,
    }
  })
}

// The full alphabet plus any repeats the word needs (SHREE has two Es).
function createPieces(word: string): Piece[] {
  const chars = ALPHABET.split('')
  word.split('').forEach((char, index) => {
    if (word.indexOf(char) !== index) {
      chars.push(char)
    }
  })

  const used = new Set<number>()
  const slots = new Map<number, number>()
  word.split('').forEach((char, slot) => {
    const index = chars.findIndex((candidate, i) => candidate === char && !used.has(i))
    used.add(index)
    slots.set(index, slot)
  })

  // wide screens: the hero copy sits bottom-left; tall screens: it fills the lower half
  const wide = layoutField(chars.length, {
    cols: 9,
    rows: 5,
    top: 0.76,
    bottom: -0.84,
    // hero copy (bottom-left) and the skip-intro link (bottom-right)
    blocked: (x, y) => (x < 0.05 && y < 0.14) || (x > 0.7 && y < -0.6),
    seed: 7,
  })
  const tall = layoutField(chars.length, {
    cols: 5,
    rows: 6,
    top: 0.74,
    bottom: 0.06,
    blocked: () => false,
    seed: 11,
  })

  let order = 0
  return chars.map((char, index) => {
    const slot = slots.get(index) ?? -1
    return { char, slot, order: slot === -1 ? order++ : -1, wide: wide[index], tall: tall[index] }
  })
}

export function ShreeWord() {
  const { font } = use(loadAssets())
  const meshes = useRef<(Mesh | null)[]>([])
  const word = profile.brand.toUpperCase()
  const pieces = useMemo(() => createPieces(word), [word])
  const glyphs = useMemo(() => {
    const unique = [...new Set(pieces.map((piece) => piece.char))].join('')
    return new Map(createGlyphs(font, unique).map((glyph) => [glyph.char, glyph]))
  }, [font, pieces])
  const awayCount = pieces.filter((piece) => piece.slot === -1).length

  const materials = useMemo(
    () => [
      new MeshPhysicalMaterial({
        color: '#ffc45e',
        metalness: 0.92,
        roughness: 0.24,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
      }),
      new MeshPhysicalMaterial({ color: '#c47a22', metalness: 0.9, roughness: 0.4 }),
    ],
    [],
  )

  const layout = useMemo(() => {
    const advances = word.split('').map((char) => glyphs.get(char)?.advance ?? 0)
    const width = advances.reduce((sum, advance) => sum + advance + TRACKING, -TRACKING)
    const xs = advances.map((advance, index) => {
      const before = advances.slice(0, index).reduce((sum, previous) => sum + previous + TRACKING, 0)
      return -width / 2 + before + advance / 2
    })
    return { xs, width }
  }, [glyphs, word])

  useEffect(
    () => () => {
      glyphs.forEach((glyph) => glyph.geometry.dispose())
      materials.forEach((material) => material.dispose())
    },
    [glyphs, materials],
  )

  useFrame(({ camera, clock, viewport }) => {
    const { assemble, lock, glow } = timeline(useAppStore.getState().scrollProgress)
    const time = clock.elapsedTime
    const view = viewport.getCurrentViewport(camera, [0, 0, 0])
    const isTall = view.aspect < 1
    const fit = Math.min(1, (view.width * (isTall ? 0.74 : 0.84)) / layout.width)
    const fieldScale = isTall ? 0.3 : 0.6
    const drift = (1 - lock) * 0.1
    // on very wide screens keep the letters near the middle instead of the far edges
    const spreadX = Math.min(view.width, view.height * 2) / 2
    const spreadY = view.height / 2
    const offsetY = wordY(view.aspect)

    pieces.forEach((piece, index) => {
      const mesh = meshes.current[index]
      if (!mesh) {
        return
      }

      const from = isTall ? piece.tall : piece.wide
      const fromX = from.x * spreadX
      const fromY = from.y * spreadY - offsetY
      const float = Math.sin(time * 0.6 + index * 1.7) * drift

      if (piece.slot >= 0) {
        // a letter of the word: fly out of the field into its place
        const gather = stagger(assemble, piece.slot, word.length, 0.3)
        const targetX = layout.xs[piece.slot] * fit * (1 + glow * 0.06)
        const wave = Math.sin(time * 1.4 - piece.slot * 0.7) * 0.05 * glow

        mesh.position.set(
          lerp(fromX, targetX, gather),
          lerp(fromY, 0, gather) + float + wave,
          lerp(from.z, 0, gather),
        )
        mesh.rotation.set(
          lerp(from.rx, 0, gather) + float * 0.5,
          lerp(from.ry, 0, gather),
          lerp(from.rz, 0, gather),
        )
        mesh.scale.setScalar(lerp(fieldScale, fit, gather) * (1 + glow * 0.06))
        return
      }

      // every other letter: drift outward and back, spinning away to nothing
      const away = stagger(Math.min(1, assemble * 1.3), piece.order, awayCount, 0.5)
      mesh.position.set(
        fromX * (1 + away * 0.8),
        fromY * (1 + away * 0.8) + float,
        from.z - away * 5,
      )
      mesh.rotation.set(from.rx + away * 1.2 + float * 0.5, from.ry + away * Math.PI, from.rz)
      const scale = fieldScale * (1 - away)
      mesh.scale.setScalar(Math.max(scale, 0.0001))
      mesh.visible = scale > 0.001
    })
  })

  return (
    <group>
      {pieces.map((piece, index) => (
        <mesh
          key={`${piece.char}-${index}`}
          ref={(node) => {
            meshes.current[index] = node
          }}
          geometry={glyphs.get(piece.char)?.geometry}
          material={materials}
        />
      ))}
    </group>
  )
}
