export function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 3, 5]} intensity={22} color="#ffd59a" />
      <pointLight position={[-5, -2, -3]} intensity={12} color="#ffb27a" />
    </>
  )
}
