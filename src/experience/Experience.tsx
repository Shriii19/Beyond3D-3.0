import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useAppStore } from '../store/useAppStore'
import { Scene } from './Scene'

export function Experience() {
  // Stop rendering once the intro has scrolled away; the last frame stays behind the content.
  const introVisible = useAppStore((state) => state.introVisible)

  return (
    <Canvas
      className="experience"
      frameloop={introVisible ? 'always' : 'never'}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9.2], fov: 42, near: 0.1, far: 40 }}
    >
      <color attach="background" args={['#07070a']} />
      <Scene />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.9} luminanceSmoothing={0.25} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.3} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
