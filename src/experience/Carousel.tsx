import { RoundedBox, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode, type ChromaticAberrationEffect } from 'postprocessing'
import { Suspense, use, useEffect, useMemo, useRef, type RefObject } from 'react'
import { Color, MathUtils, MeshBasicMaterial, MeshPhysicalMaterial, Vector2, type Group } from 'three'
import { projects } from '../content'
import { loadCanvasFonts } from '../lib/assets'
import { pointer } from '../lib/pointer'
import { createProjectTexture } from '../lib/projectTexture'
import { useAppStore } from '../store/useAppStore'
import { Studio } from './Studio'

const CARD_W = 3.2
const CARD_H = 2
const DEPTH = 0.12
const DIM = new Color('#3a3530')
const FULL = new Color(1, 1, 1)

// Shared between the cards and the glitch pass: how fast the carousel is turning.
const motion = { position: 0, velocity: 0 }

function Cards() {
  use(loadCanvasFonts())
  const groupRef = useRef<Group>(null)
  const cards = useRef<(Group | null)[]>([])
  const textures = useMemo(() => projects.map((project, index) => createProjectTexture(project, index)), [])
  const faces = useMemo(
    () => textures.map((map) => new MeshBasicMaterial({ map, toneMapped: false })),
    [textures],
  )
  const frame = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#e6a640',
        metalness: 0.95,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.25,
      }),
    [],
  )

  useEffect(
    () => () => {
      textures.forEach((texture) => texture.dispose())
      faces.forEach((face) => face.dispose())
      frame.dispose()
    },
    [textures, faces, frame],
  )

  useFrame(({ camera, clock, viewport }, delta) => {
    const view = viewport.getCurrentViewport(camera, [0, 0, 0])
    const isTall = view.aspect < 1
    const target = useAppStore.getState().workProgress * Math.max(0, projects.length - 1)
    const previous = motion.position
    motion.position = MathUtils.damp(motion.position, target, 5, delta)
    motion.velocity = Math.abs(motion.position - previous) / Math.max(delta, 1e-3)

    const scale = isTall
      ? Math.min(1, (view.width * 0.84) / CARD_W)
      : Math.min(1, (view.width * 0.44) / CARD_W, (view.height * 0.54) / CARD_H)
    const time = clock.elapsedTime

    const group = groupRef.current
    if (group) {
      // desktop: card on the left, details panel on the right; phone: card on top
      group.position.x = isTall ? 0 : -view.width * 0.15
      group.position.y = isTall ? view.height * 0.17 : 0.05
      group.rotation.y = MathUtils.damp(group.rotation.y, pointer.x * 0.12, 3, delta)
      group.rotation.x = MathUtils.damp(group.rotation.x, -pointer.y * 0.08, 3, delta)
    }

    cards.current.forEach((card, index) => {
      if (!card) {
        return
      }
      const offset = index - motion.position
      const distance = Math.abs(offset)

      // cover-flow arc: neighbours swing back and turn toward the centre
      card.position.set(
        offset * CARD_W * scale * 0.82,
        Math.sin(time * 0.8 + index) * 0.03,
        -distance * 1.3 * scale,
      )
      card.rotation.set(0, -offset * 0.5, offset * 0.04)
      card.scale.setScalar(scale * (1 - Math.min(distance, 1) * 0.08))
      card.visible = distance < 2.6

      faces[index].color.copy(DIM).lerp(FULL, 1 - Math.min(distance, 1))
    })
  })

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => (
        <group
          key={project.title}
          ref={(node) => {
            cards.current[index] = node
          }}
        >
          <RoundedBox args={[CARD_W, CARD_H, DEPTH]} radius={0.07} smoothness={4} material={frame} />
          <mesh position-z={DEPTH / 2 + 0.002} material={faces[index]}>
            <planeGeometry args={[CARD_W - 0.12, CARD_H - 0.12]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Splits the colour channels while the carousel moves, then settles back to clean.
function Glitch({ effect }: { effect: RefObject<ChromaticAberrationEffect | null> }) {
  const amount = useRef(0)

  useFrame(({ clock }, delta) => {
    const pass = effect.current
    if (!pass) {
      return
    }
    const target = Math.min(0.004, motion.velocity * 0.0025)
    amount.current = MathUtils.damp(amount.current, target, 8, delta)
    pass.offset.set(amount.current * Math.cos(clock.elapsedTime * 4), amount.current * 0.6)
  })
  return null
}

export function Carousel() {
  const visible = useAppStore((state) => state.workVisible)
  const aberration = useRef<ChromaticAberrationEffect>(null)
  const initialOffset = useMemo(() => new Vector2(0, 0), [])

  return (
    <Canvas
      className="carousel-canvas"
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 40 }}
    >
      <color attach="background" args={['#07070a']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 5]} intensity={18} color="#ffd59a" />
      <Studio />
      <Sparkles count={60} scale={[14, 8, 6]} size={2.2} speed={0.2} opacity={0.5} color="#ffcf7a" />
      <Suspense fallback={null}>
        <Cards />
      </Suspense>
      <Glitch effect={aberration} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.25} />
        <ChromaticAberration ref={aberration} offset={initialOffset} radialModulation={false} modulationOffset={0} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
