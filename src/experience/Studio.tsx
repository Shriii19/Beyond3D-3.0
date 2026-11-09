import { Environment, Lightformer } from '@react-three/drei'

// Warm studio lighting built from light panels, so no HDR file is downloaded.
// Shared by the intro scene and the Work carousel so the gold reads the same.
export function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* a broad warm panel behind the camera is what the gold faces reflect */}
      <Lightformer form="rect" intensity={2.2} color="#ffd48a" position={[0, 1, 12]} rotation-y={Math.PI} scale={[16, 6, 1]} />
      <Lightformer form="rect" intensity={4} color="#fff1d6" position={[0, 6, -2]} rotation-x={Math.PI / 2} scale={[14, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[-7, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="ring" intensity={3} color="#ffffff" position={[5, 3, 6]} scale={2.5} />
    </Environment>
  )
}
