import { Component, Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function OrbitingForms({ pointer }) {
  const sculpture = useRef()
  const orbitA = useRef()
  const orbitB = useRef()
  const { viewport } = useThree()
  const isMobile = viewport.width < 6

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    if (sculpture.current) {
      sculpture.current.rotation.y = THREE.MathUtils.damp(
        sculpture.current.rotation.y,
        pointer.current.x * 0.12 + Math.sin(time * 0.28) * 0.08,
        2,
        delta,
      )
      sculpture.current.rotation.x = Math.sin(time * 0.22) * 0.06
    }
    if (orbitA.current) orbitA.current.rotation.z = time * 0.12
    if (orbitB.current) orbitB.current.rotation.z = -time * 0.08
  })

  return (
    <group position={[viewport.width * (isMobile ? 0.08 : 0.25), isMobile ? -1.55 : 0, 0]} scale={isMobile ? 0.7 : 1.08}>
      <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.18}>
        <group ref={sculpture}>
          {/* A soft sculpted orange core */}
          <mesh castShadow>
            <icosahedronGeometry args={[0.9, 7]} />
            <MeshDistortMaterial
              color="#e9783d"
              roughness={0.2}
              metalness={0.16}
              clearcoat={1}
              clearcoatRoughness={0.12}
              distort={0.18}
              speed={0.55}
            />
          </mesh>

          {/* Fine plum and champagne orbital lines */}
          <group ref={orbitA} rotation={[0.85, 0.2, 0.25]}>
            <mesh>
              <torusGeometry args={[1.48, 0.012, 12, 160]} />
              <meshStandardMaterial color="#75405b" roughness={0.3} metalness={0.55} />
            </mesh>
          </group>
          <group ref={orbitB} rotation={[1.12, -0.55, -0.38]}>
            <mesh>
              <torusGeometry args={[1.78, 0.009, 10, 160]} />
              <meshStandardMaterial color="#f3c17b" roughness={0.3} metalness={0.68} />
            </mesh>
          </group>

          {/* Small polished forms catch the light as the sculpture turns */}
          <mesh position={[1.38, 0.46, 0.1]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshPhysicalMaterial color="#fff5e7" roughness={0.12} metalness={0.12} clearcoat={1} />
          </mesh>
          <mesh position={[-1.18, -0.68, 0.42]}>
            <sphereGeometry args={[0.105, 28, 28]} />
            <meshStandardMaterial color="#75405b" roughness={0.22} metalness={0.25} />
          </mesh>
          <mesh position={[0.1, 1.28, -0.35]}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial color="#f3c17b" roughness={0.25} metalness={0.5} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

function Scene() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} color="#fff1df" />
      <pointLight position={[-3, 1, 3]} intensity={28} distance={8} color="#f49a62" />
      <pointLight position={[2, -2, -2]} intensity={22} distance={7} color="#9d6685" />
      <OrbitingForms pointer={pointer} />
    </>
  )
}

function SculptureFallback() {
  return (
    <div className="hero-canvas-fallback" aria-hidden="true">
      <div className="sculpture-ring sculpture-ring-outer" />
      <div className="sculpture-ring sculpture-ring-inner" />
      <div className="sculpture-orb">
        <span className="sculpture-orb-glint" />
      </div>
      <span className="sculpture-pearl sculpture-pearl-one" />
      <span className="sculpture-pearl sculpture-pearl-two" />
      <span className="sculpture-pearl sculpture-pearl-three" />
    </div>
  )
}

class WebGLErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Hero3D() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <WebGLErrorBoundary fallback={<SculptureFallback />}>
        <Canvas
          className="hero-canvas"
          fallback={<SculptureFallback />}
          dpr={[1, 1.35]}
          camera={{ position: [0, 0, 7], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}
