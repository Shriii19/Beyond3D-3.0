import { useEffect, useRef } from 'react'
import { loadAssets } from '../lib/assets'
import { gsap } from '../lib/gsap'
import { useAppStore } from '../store/useAppStore'

export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const progress = useAppStore((state) => state.progress)
  const isReady = useAppStore((state) => state.isReady)
  const immersive = useAppStore((state) => state.immersive)
  const setImmersive = useAppStore((state) => state.setImmersive)
  const setProgress = useAppStore((state) => state.setProgress)
  const setReady = useAppStore((state) => state.setReady)

  useEffect(() => {
    if (isReady) {
      return
    }

    let cancelled = false
    const proxy = { value: 0 }
    const update = () => setProgress(Math.round(proxy.value))
    // Count to 90 on a timer, then finish only once the fonts for the 3D word are in.
    const tween = gsap.to(proxy, { value: 90, duration: 0.9, ease: 'power2.out', onUpdate: update })
    const assets = immersive ? loadAssets() : document.fonts.ready

    Promise.all([assets, tween.then()]).then(
      () => {
        if (cancelled) {
          return
        }
        gsap.to(proxy, {
          value: 100,
          duration: 0.25,
          onUpdate: update,
          onComplete: () => {
            gsap.to(rootRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => setReady(true),
            })
          },
        })
      },
      (error: unknown) => {
        if (cancelled) {
          return
        }
        console.error('Unable to load the 3D experience; using the static layout instead.', error)
        tween.kill()
        setImmersive(false)
      },
    )

    return () => {
      cancelled = true
      tween.kill()
    }
  }, [immersive, isReady, setImmersive, setProgress, setReady])

  if (isReady) {
    return null
  }

  return (
    <div className="loader" ref={rootRef} role="status" aria-label="Loading">
      <span className="loader-mark">SHREE</span>
      <span className="loader-count">{String(progress).padStart(3, '0')}</span>
    </div>
  )
}
