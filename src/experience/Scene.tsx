import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { MathUtils, type Group } from 'three'
import { lerp } from '../lib/math'
import { pointer } from '../lib/pointer'
import { useAppStore } from '../store/useAppStore'
import { Lights } from './Lights'
import { Studio } from './Studio'
import { ShreeWord } from './ShreeWord'
import { Halo } from './Halo'
import { timeline, wordY } from './timeline'

export function Scene() {
  const rootRef = useRef<Group>(null)

  useFrame(({ camera, viewport }, delta) => {
    const { assemble, glow } = timeline(useAppStore.getState().scrollProgress)
    camera.position.z = lerp(9.2, 7.6, assemble) - glow * 0.4

    const root = rootRef.current
    if (!root) {
      return
    }

    // Gentle tilt toward the pointer gives the word real depth.
    root.position.y = wordY(viewport.aspect)
    root.rotation.y = MathUtils.damp(root.rotation.y, pointer.x * 0.28, 3, delta)
    root.rotation.x = MathUtils.damp(root.rotation.x, -pointer.y * 0.16, 3, delta)
  })

  return (
    <>
      <Lights />
      <Studio />
      <Sparkles count={80} scale={[16, 10, 8]} size={2.4} speed={0.25} opacity={0.55} color="#ffcf7a" />
      <group ref={rootRef}>
        <Suspense fallback={null}>
          <Halo />
          <ShreeWord />
        </Suspense>
      </group>
    </>
  )
}
