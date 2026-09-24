import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

function Blob({ mouse }) {
  const mesh = useRef()

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.x = t * 0.12 + mouse.current.y * 0.3
    mesh.current.rotation.y = t * 0.16 + mouse.current.x * 0.3
  })

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={mesh} scale={2.15}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.42}
          speed={2.2}
          roughness={0.15}
          metalness={0.3}
          emissive="#ff3ea5"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  )
}

function Ring({ radius, color, tilt, speed }) {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.z = state.clock.getElapsedTime() * speed
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0.4, 0]}>
      <torusGeometry args={[radius, 0.014, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  )
}

function Scene() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color="#ff3ea5" />
      <pointLight position={[-4, -3, -2]} intensity={1.2} color="#22d3ee" />
      <Blob mouse={mouse} />
      <Ring radius={2.9} color="#22d3ee" tilt={0.9} speed={0.08} />
      <Ring radius={3.35} color="#ffb800" tilt={-0.5} speed={-0.06} />
    </group>
  )
}

export default function Hero3D() {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
