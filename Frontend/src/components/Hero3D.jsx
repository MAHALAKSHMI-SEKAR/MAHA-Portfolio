import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import './hero.css'

const sparks = [
  { label: 'React', color: '#76d7e5', position: [-1.25, 0.78, 0.42] },
  { label: 'Java', color: '#f2bd79', position: [1.22, 0.62, 0.4] },
  { label: 'UI', color: '#d7a5d4', position: [0.98, -0.9, 0.46] },
  { label: 'API', color: '#b8d89a', position: [-1.15, -0.82, 0.5] },
]

function SkillSpark({ item, onCollect }) {
  const ref = useRef()
  const [collected, setCollected] = useState(false)
  useFrame(({ clock }) => {
    if (ref.current && !collected) ref.current.rotation.y = Math.sin(clock.elapsedTime * 1.4 + item.position[0]) * 0.22
  })
  if (collected) return null
  return (
    <Float speed={1.6} floatIntensity={0.28} rotationIntensity={0.12}>
      <group ref={ref} position={item.position} onClick={(event) => {
        event.stopPropagation()
        setCollected(true)
        onCollect()
      }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
        <mesh>
          <icosahedronGeometry args={[0.19, 1]} />
          <meshPhysicalMaterial color={item.color} roughness={0.2} metalness={0.28} clearcoat={1} emissive={item.color} emissiveIntensity={0.18} />
        </mesh>
        <Text position={[0, -0.34, 0]} fontSize={0.13} color="#4d3445" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#fffaf5">{item.label}</Text>
      </group>
    </Float>
  )
}

function Scene({ onCollect, score }) {
  const group = useRef()
  const { viewport } = useThree()
  const dragging = useRef(false)
  const previousX = useRef(0)
  useFrame((_, delta) => {
    if (group.current && !dragging.current) group.current.rotation.y += delta * 0.11
  })
  const startDrag = (event) => { event.stopPropagation(); dragging.current = true; previousX.current = event.clientX }
  const moveDrag = (event) => {
    if (!dragging.current || !group.current) return
    const change = event.clientX - previousX.current
    previousX.current = event.clientX
    group.current.rotation.y += change * 0.008
    group.current.rotation.x = THREE.MathUtils.clamp(group.current.rotation.x + event.movementY * 0.004, -0.35, 0.35)
  }
  const stopDrag = () => { dragging.current = false }
  const small = viewport.width < 6
  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff2df" />
      <pointLight position={[-3, 1, 3]} intensity={20} distance={8} color="#f49a62" />
      <pointLight position={[2, -2, -2]} intensity={16} distance={7} color="#9d6685" />
      <group position={[small ? 0 : 0.05, 0, 0]} scale={small ? 0.9 : 1.1} ref={group}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerLeave={stopDrag}>
        <Float speed={0.8} rotationIntensity={0.07} floatIntensity={0.14}>
          <mesh position={[0, 0.42, -0.28]}><boxGeometry args={[1.55, 1.02, 0.1]} /><meshPhysicalMaterial color="#75405b" roughness={0.22} metalness={0.35} clearcoat={1} /></mesh>
          <mesh position={[0, 0.42, -0.215]}><boxGeometry args={[1.38, 0.84, 0.025]} /><meshBasicMaterial color="#fff4e6" /></mesh>
          <Text position={[0, 0.45, -0.19]} fontSize={0.42} color="#d7652c" anchorX="center" anchorY="middle">{'{ }'}</Text>
          <mesh position={[0, -0.18, 0.04]}><boxGeometry args={[1.82, 0.14, 1.02]} /><meshPhysicalMaterial color="#f2c17b" roughness={0.28} metalness={0.48} clearcoat={0.8} /></mesh>
          <mesh position={[0, -0.095, 0.02]}><boxGeometry args={[0.48, 0.018, 0.2]} /><meshStandardMaterial color="#fff3df" roughness={0.35} /></mesh>
          <mesh position={[0, -1.28, 0]}><cylinderGeometry args={[0.58, 0.72, 0.12, 48]} /><meshStandardMaterial color="#75405b" roughness={0.26} metalness={0.38} /></mesh>
          <mesh position={[0, -1.18, 0]}><cylinderGeometry args={[0.48, 0.48, 0.09, 48]} /><meshStandardMaterial color="#f3c17b" roughness={0.24} metalness={0.6} /></mesh>
          <mesh position={[0.9, 0.18, 0.12]}><sphereGeometry args={[0.12, 28, 28]} /><meshPhysicalMaterial color="#fff5e7" roughness={0.12} clearcoat={1} /></mesh>
        </Float>
        {sparks.map((item) => <SkillSpark key={item.label} item={item} onCollect={onCollect} />)}
      </group>
      <Text position={[0, -2.02, 0]} fontSize={0.12} color="#75405b" anchorX="center" anchorY="middle">{score === sparks.length ? 'All sparks collected!' : 'Drag to spin · tap a spark to collect'}</Text>
    </>
  )
}

export default function Hero3D() {
  const [score, setScore] = useState(0)
  return (
    <div className="hero-visual" aria-label="Interactive 3D portfolio sculpture. Drag to spin and tap the floating skill gems to collect them.">
      <div className="hero-game-hud" aria-live="polite"><span className="hero-game-dot" /> Spark hunt <strong>{score}/{sparks.length}</strong></div>
      <Canvas className="hero-canvas" dpr={[1, 1.35]} camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
        <Suspense fallback={null}><Scene score={score} onCollect={() => setScore((current) => Math.min(sparks.length, current + 1))} /></Suspense>
      </Canvas>
    </div>
  )
}
