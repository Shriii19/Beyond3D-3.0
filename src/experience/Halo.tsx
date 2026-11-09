import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, CanvasTexture, MeshBasicMaterial, SRGBColorSpace, type Mesh } from 'three'
import { useAppStore } from '../store/useAppStore'
import { timeline } from './timeline'

function haloTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(245, 165, 36, 0.22)')
    gradient.addColorStop(0.45, 'rgba(245, 165, 36, 0.07)')
    gradient.addColorStop(1, 'rgba(245, 165, 36, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

// A soft warm glow that rises behind SHREE in the final chapter.
export function Halo() {
  const meshRef = useRef<Mesh>(null)
  const texture = useMemo(() => haloTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(({ clock }) => {
    const material = meshRef.current?.material
    if (material instanceof MeshBasicMaterial) {
      const { glow } = timeline(useAppStore.getState().scrollProgress)
      material.opacity = glow * (0.85 + Math.sin(clock.elapsedTime * 1.2) * 0.15)
    }
  })

  return (
    <mesh ref={meshRef} position-z={-1} scale={[10, 5, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
    </mesh>
  )
}
