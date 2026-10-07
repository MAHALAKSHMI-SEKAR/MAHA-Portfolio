import { Component, Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Mascot({ pointer }) {
  const mascot = useRef()
  const eyes = useRef([])
  const wavePaw = useRef()
  const { viewport } = useThree()
  const isMobile = viewport.width < 6

  useFrame((state, delta) => {
    if (!mascot.current) return
    const time = state.clock.getElapsedTime()
    mascot.current.rotation.y = THREE.MathUtils.damp(
      mascot.current.rotation.y,
      pointer.current.x * 0.18 + Math.sin(time * 0.55) * 0.08,
      3,
      delta,
    )
    mascot.current.rotation.z = Math.sin(time * 0.8) * 0.025
    if (wavePaw.current) wavePaw.current.rotation.z = -0.9 + Math.sin(time * 2.6) * 0.16

    // A quick, occasional blink keeps the little character feeling alive.
    const blink = time % 4.2 > 3.98 && time % 4.2 < 4.1
    eyes.current.forEach((eye) => {
      if (eye) eye.scale.y = THREE.MathUtils.damp(eye.scale.y, blink ? 0.12 : 1, 24, delta)
    })
  })

  return (
    <group position={[viewport.width * (isMobile ? 0.08 : 0.25), isMobile ? -1.55 : -0.05, 0]} scale={isMobile ? 0.68 : 1.05}>
      <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.55}>
        <group ref={mascot}>
          {/* Soft round head */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <sphereGeometry args={[0.88, 48, 48]} />
            <meshStandardMaterial color="#fff8f0" roughness={0.42} />
          </mesh>

          {/* Little pointed ears */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.57, 1.06, 0]} rotation={[0, 0, side * -0.16]}>
              <mesh rotation={[0, 0, side * -0.12]} castShadow>
                <coneGeometry args={[0.27, 0.58, 32]} />
                <meshStandardMaterial color="#fff8f0" roughness={0.42} />
              </mesh>
              <mesh position={[0, -0.04, 0.15]} rotation={[0, 0, side * -0.12]}>
                <coneGeometry args={[0.13, 0.34, 32]} />
                <meshStandardMaterial color="#e97873" roughness={0.5} />
              </mesh>
            </group>
          ))}

          {/* Blush and bright, friendly eyes */}
          {[-1, 1].map((side, index) => (
            <group key={side}>
              <mesh ref={(node) => { eyes.current[index] = node }} position={[side * 0.34, 0.38, 0.69]} scale={[1, 1, 1]}>
                <sphereGeometry args={[0.105, 24, 24]} />
                <meshStandardMaterial color="#35252a" roughness={0.28} />
              </mesh>
              <mesh position={[side * 0.355 - 0.025, 0.42, 0.78]}>
                <sphereGeometry args={[0.028, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[side * 0.53, 0.12, 0.64]} scale={[1.25, 0.65, 0.3]}>
                <sphereGeometry args={[0.12, 24, 24]} />
                <meshBasicMaterial color="#f2a09a" transparent opacity={0.68} />
              </mesh>
            </group>
          ))}

          {/* Tiny nose and curved smile */}
          <mesh position={[0, 0.19, 0.78]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color="#d7655c" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.08, 0.77]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.09, 0.016, 10, 24, Math.PI]} />
            <meshStandardMaterial color="#75405b" roughness={0.55} />
          </mesh>

          {/* Rounded orange body and plum collar */}
          <mesh position={[0, -0.83, 0]} scale={[0.73, 0.63, 0.58]} castShadow>
            <sphereGeometry args={[1, 40, 40]} />
            <meshStandardMaterial color="#e9783d" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.48, 0.02]} rotation={[0.08, 0, 0]}>
            <torusGeometry args={[0.52, 0.105, 16, 48]} />
            <meshStandardMaterial color="#75405b" roughness={0.42} />
          </mesh>
          <mesh position={[0, -0.84, 0.555]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshStandardMaterial color="#fff4df" roughness={0.3} />
          </mesh>

          {/* Waving paws */}
          <mesh position={[-0.72, -0.67, 0.03]} rotation={[0, 0, -0.52]} scale={[0.22, 0.39, 0.24]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color="#fff8f0" roughness={0.42} />
          </mesh>
          <mesh ref={wavePaw} position={[0.77, -0.5, 0.04]} rotation={[0, 0, -0.9]} scale={[0.22, 0.39, 0.24]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color="#fff8f0" roughness={0.42} />
          </mesh>

          {/* Small golden star badge */}
          <mesh position={[0.38, -0.83, 0.54]} rotation={[0, 0, 0.15]}>
            <dodecahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color="#f3b64a" metalness={0.18} roughness={0.32} />
          </mesh>
        </group>
      </Float>
      <Sparkles count={24} scale={[3.4, 3.8, 2]} size={3} speed={0.35} color="#fff5dd" />
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
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} color="#fff2dc" />
      <pointLight position={[-3, 1, 2]} intensity={32} distance={8} color="#f49b62" />
      <pointLight position={[3, -2, -1]} intensity={20} distance={7} color="#ad7895" />
      <Mascot pointer={pointer} />
    </>
  )
}

function MascotFallback() {
  return (
    <div className="hero-canvas-fallback" aria-hidden="true">
      <div className="buddy-fallback">
        <span className="buddy-ear buddy-ear-left" />
        <span className="buddy-ear buddy-ear-right" />
        <div className="buddy-face">
          <span className="buddy-eye buddy-eye-left" />
          <span className="buddy-eye buddy-eye-right" />
          <span className="buddy-cheek buddy-cheek-left" />
          <span className="buddy-cheek buddy-cheek-right" />
          <span className="buddy-nose" />
          <span className="buddy-smile" />
        </div>
        <div className="buddy-body">
          <span className="buddy-collar" />
          <span className="buddy-badge">✦</span>
          <span className="buddy-paw buddy-paw-left" />
          <span className="buddy-paw buddy-paw-right" />
        </div>
        <span className="buddy-sparkle buddy-sparkle-one">✦</span>
        <span className="buddy-sparkle buddy-sparkle-two">✧</span>
      </div>
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
      <WebGLErrorBoundary fallback={<MascotFallback />}>
        <Canvas
          className="hero-canvas"
          fallback={<MascotFallback />}
          dpr={[1, 1.5]}
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
