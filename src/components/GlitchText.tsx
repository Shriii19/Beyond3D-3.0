import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/support'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>[]{}'
const DURATION = 700

type Props = {
  text: string
  className?: string
}

// Scrambles through random glyphs and resolves left to right, with an RGB split
// while it runs. Replays whenever the text changes or the pointer enters.
export function GlitchText({ text, className = '' }: Props) {
  const [shown, setShown] = useState(text)
  const [running, setRunning] = useState(false)
  const frame = useRef(0)

  const play = useCallback(() => {
    cancelAnimationFrame(frame.current)
    if (prefersReducedMotion()) {
      setShown(text)
      return
    }

    const reveal = text.split('').map((_, index) => (index / text.length) * 0.6 + Math.random() * 0.3)
    const start = performance.now()
    setRunning(true)

    const tick = (now: number) => {
      const t = (now - start) / DURATION
      if (t >= 1) {
        setShown(text)
        setRunning(false)
        return
      }
      setShown(
        text
          .split('')
          .map((char, index) =>
            char === ' ' || t >= reveal[index] ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      )
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [text])

  useEffect(() => {
    frame.current = requestAnimationFrame(play)
    return () => cancelAnimationFrame(frame.current)
  }, [play])

  return (
    <span
      className={`glitch${running ? ' is-glitching' : ''} ${className}`}
      aria-label={text}
      onPointerEnter={play}
    >
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
