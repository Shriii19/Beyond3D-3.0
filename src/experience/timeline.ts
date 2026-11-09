import { smoothstep } from '../lib/math'

// Maps intro scroll progress (0..1) to the stages of the 3D story.
// Keep these in sync with the copy in Story.tsx.
export function timeline(progress: number) {
  return {
    // S, H, R, E, E leave the alphabet and fly into the word; the rest drift away
    assemble: smoothstep(0.08, 0.46, progress),
    // SHREE settles and holds
    lock: smoothstep(0.42, 0.54, progress),
    // SHREE lights up for the finale
    glow: smoothstep(0.66, 0.92, progress),
  }
}

// Same stage, offset per item so pieces move one after another.
export function stagger(value: number, index: number, count: number, spread = 0.35) {
  const offset = (index / Math.max(1, count - 1)) * spread
  return smoothstep(offset, offset + (1 - spread), value)
}

// The word sits a little above centre so the copy below never covers it.
export function wordY(aspect: number) {
  return aspect < 1 ? 0.6 : 0.5
}
