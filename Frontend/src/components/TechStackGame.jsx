import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, RoundedBox, Text } from '@react-three/drei'
import '../styles/tech-stack-game.css'

const TECHNOLOGIES = ['JAVA', 'SPRING BOOT', 'REACT', 'MYSQL', 'REST API', 'JWT', 'AI', 'GIT', 'JAVASCRIPT', 'HTML/CSS']
const BLOCK_COLORS = ['#75405b', '#c45c37', '#667b70', '#d19a53', '#506b83', '#ab7284']
const BLOCK_HEIGHT = 0.38
const BASE_Y = -1.72
const BASE_HEIGHT = 0.46
const CRANE_Y = 2.02
const START_SCREEN_Y = 1.48
const MIN_BLOCK_WIDTH = 0.9
const MILESTONES = { 10: 'BACKEND UNLOCKED', 20: 'FULL STACK MODE', 30: 'AI MODE ACTIVATED', 50: 'PRODUCTION READY' }

const pickTechnology = () => TECHNOLOGIES[Math.floor(Math.random() * TECHNOLOGIES.length)]
const colorFor = (label, index) => BLOCK_COLORS[(TECHNOLOGIES.indexOf(label) + index) % BLOCK_COLORS.length]

function readBest() {
  try { return Number(window.localStorage.getItem('stack-the-tech-best') || 0) || 0 } catch { return 0 }
}

function TechBlock({ label, color, width, height = BLOCK_HEIGHT, position, newest = false, prefersReducedMotion = false }) {
  const mesh = useRef()
  const bornAt = useRef(null)
  useFrame((state) => {
    if (!newest || prefersReducedMotion || !mesh.current) return
    if (bornAt.current === null) bornAt.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - bornAt.current
    const bump = elapsed < 0.28 ? 1 + Math.sin((elapsed / 0.28) * Math.PI) * 0.12 : 1
    mesh.current.scale.y = bump
  })
  const fontSize = Math.min(0.18, Math.max(0.1, width / (label.length * 0.72)))
  return (
    <group position={position}>
      <RoundedBox ref={mesh} args={[width, height, 0.38]} radius={0.055} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.12} />
      </RoundedBox>
      <Text position={[0, 0, 0.205]} fontSize={fontSize} maxWidth={width - 0.18} color="#fffaf5" anchorX="center" anchorY="middle" textAlign="center" letterSpacing={0.025}>
        {label}
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </group>
  )
}

function Crane({ cableRef, hookRef, trolleyRef, width }) {
  const supportX = -width * 0.43
  return (
    <group>
      <mesh position={[supportX, 0.05, -0.08]} castShadow>
        <boxGeometry args={[0.13, 4.05, 0.2]} />
        <meshStandardMaterial color="#d8c9bb" roughness={0.45} metalness={0.14} />
      </mesh>
      <mesh position={[supportX + width * 0.43, CRANE_Y, -0.08]} castShadow>
        <boxGeometry args={[width * 0.9, 0.14, 0.24]} />
        <meshStandardMaterial color="#75405b" roughness={0.36} metalness={0.18} />
      </mesh>
      <mesh position={[supportX + 0.24, -1.92, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.48]} />
        <meshStandardMaterial color="#d19a53" roughness={0.4} metalness={0.2} />
      </mesh>
      <group ref={trolleyRef}>
        <mesh position={[0, CRANE_Y - 0.1, 0]} castShadow>
          <boxGeometry args={[0.33, 0.18, 0.32]} />
          <meshStandardMaterial color="#d19a53" roughness={0.32} metalness={0.3} />
        </mesh>
        <mesh ref={cableRef} position={[0, CRANE_Y - 0.45, 0.02]}>
          <boxGeometry args={[0.035, 1, 0.04]} />
          <meshStandardMaterial color="#a78a70" roughness={0.56} />
        </mesh>
        <mesh ref={hookRef}>
          <torusGeometry args={[0.1, 0.035, 8, 18, Math.PI]} />
          <meshStandardMaterial color="#c45c37" roughness={0.3} metalness={0.28} />
        </mesh>
      </group>
    </group>
  )
}

function SparkBurst({ position }) {
  const group = useRef()
  const started = useRef(null)
  const particles = useMemo(() => Array.from({ length: 8 }, (_, index) => ({
    angle: (index / 8) * Math.PI * 2,
    lift: 0.35 + (index % 3) * 0.12,
  })), [])
  useFrame((state) => {
    if (!group.current) return
    if (started.current === null) started.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - started.current
    group.current.visible = elapsed < 0.55
    if (elapsed >= 0.55) return
    group.current.children.forEach((particle, index) => {
      const data = particles[index]
      particle.position.x = Math.cos(data.angle) * elapsed * 1.7
      particle.position.y = Math.sin(data.angle) * elapsed * 1.7 + data.lift * elapsed
      particle.scale.setScalar(Math.max(0.05, 1 - elapsed * 1.7))
    })
  })
  return <group ref={group} position={position}>{particles.map((particle, index) => <mesh key={index}>
    <sphereGeometry args={[0.035, 8, 8]} />
    <meshBasicMaterial color={index % 2 ? '#f3c17b' : '#e9783d'} />
  </mesh>)}</group>
}

function GameScene({ score, phase, tower, label, blockWidth, color, resetKey, liveX, onLand, onMiss, prefersReducedMotion }) {
  const { viewport } = useThree()
  const baseWidth = Math.min(4.4, viewport.width * 0.8)
  const maxTravel = Math.min(viewport.width * 0.32, 3.2)
  const cameraShift = Math.max(0, BASE_Y + BASE_HEIGHT / 2 + (score + 0.5) * BLOCK_HEIGHT - 0.25)
  const targetY = BASE_Y + BASE_HEIGHT / 2 + (score + 0.5) * BLOCK_HEIGHT
  const activeY = useRef(START_SCREEN_Y)
  const previousPhase = useRef('moving')
  const previousResetKey = useRef(resetKey)
  const motionEpoch = useRef(null)
  const landHandled = useRef(false)
  const missHandled = useRef(false)
  const trolley = useRef()
  const cable = useRef()
  const hook = useRef()
  const blockMesh = useRef()

  useEffect(() => {
    activeY.current = START_SCREEN_Y + cameraShift
    previousPhase.current = 'moving'
    landHandled.current = false
    missHandled.current = false
  }, [resetKey])

  useFrame((state, delta) => {
    if (motionEpoch.current === null || previousResetKey.current !== resetKey) {
      motionEpoch.current = state.clock.elapsedTime
      previousResetKey.current = resetKey
      liveX.current = 0
    }
    if (phase !== previousPhase.current) {
      if (phase === 'falling') landHandled.current = false
      if (phase === 'missed') missHandled.current = false
      previousPhase.current = phase
    }
    const speed = prefersReducedMotion ? 0 : 0.9 + 2.1 * (1 - Math.exp(-score / 45))
    if (phase === 'moving') {
      const x = prefersReducedMotion ? 0 : Math.sin((state.clock.elapsedTime - motionEpoch.current) * speed) * maxTravel
      liveX.current = x
      activeY.current = START_SCREEN_Y + cameraShift
    } else if (phase === 'falling') {
      activeY.current -= delta * 4.8
      if (activeY.current <= targetY && !landHandled.current) {
        activeY.current = targetY
        landHandled.current = true
        onLand(liveX.current, baseWidth)
      }
    } else if (phase === 'missed') {
      activeY.current -= delta * 6.2
      if (activeY.current - cameraShift < -2.65 && !missHandled.current) {
        missHandled.current = true
        onMiss()
      }
    }

    if (trolley.current) trolley.current.position.x = liveX.current
    if (cable.current) {
      const screenY = activeY.current - cameraShift
      const hookY = screenY + BLOCK_HEIGHT / 2 + 0.08
      const length = Math.max(0.18, CRANE_Y - hookY)
      cable.current.position.y = CRANE_Y - length / 2
      cable.current.scale.y = length
      if (hook.current) hook.current.position.y = hookY
    }
    if (blockMesh.current) {
      // The block is inside the camera-following group, so apply the world Y
      // position here and let that parent apply cameraShift exactly once.
      blockMesh.current.position.set(liveX.current, activeY.current, 0.05)
    }
  })

  const visibleTower = tower.slice(-10)
  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 12]} zoom={80} near={0.1} far={60} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[3, 5, 7]} intensity={2.2} color="#fff4e8" castShadow />
      <directionalLight position={[-4, 1, 3]} intensity={0.7} color="#b38a75" />
      <Crane cableRef={cable} hookRef={hook} trolleyRef={trolley} width={viewport.width} />
      <group position={[0, -cameraShift, 0]}>
        <mesh position={[0, BASE_Y, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[baseWidth, BASE_HEIGHT, 0.62]} />
          <meshStandardMaterial color="#3f594f" roughness={0.42} />
        </mesh>
        <Text position={[0, BASE_Y, 0.31]} fontSize={0.19} color="#fffaf5" anchorX="center" anchorY="middle" letterSpacing={0.12}>MAHALAKSHMI&apos;S STACK</Text>
        {visibleTower.map((block) => <TechBlock key={block.id} label={block.label} color={block.color} width={block.width} position={[block.x, block.y, 0.03]} newest={block.id === score} prefersReducedMotion={prefersReducedMotion} />)}
        <group ref={blockMesh}>
          <TechBlock label={label} color={color} width={blockWidth} position={[0, 0, 0]} />
        </group>
      </group>
      <mesh position={[0, -2.07, -0.5]} receiveShadow>
        <boxGeometry args={[viewport.width, 0.14, 1]} />
        <meshStandardMaterial color="#eadfd4" roughness={0.85} />
      </mesh>
    </>
  )
}

export default function TechStackGame() {
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [lives, setLives] = useState(3)
  const [phase, setPhase] = useState('moving')
  const [tower, setTower] = useState([])
  const [label, setLabel] = useState(pickTechnology)
  const [blockWidth, setBlockWidth] = useState(3.55)
  const [milestone, setMilestone] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [burst, setBurst] = useState(null)
  const liveX = useRef(0)
  const milestoneTimer = useRef(null)
  const phaseRef = useRef(phase)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  phaseRef.current = phase
  const color = colorFor(label, score)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches)
    updateMotionPreference()
    motionPreference.addEventListener?.('change', updateMotionPreference)
    const onKeyDown = (event) => {
      if (event.code === 'Space' && !['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'SELECT'].includes(document.activeElement?.tagName)) {
        event.preventDefault()
        if (phaseRef.current === 'moving') setPhase('falling')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      motionPreference.removeEventListener?.('change', updateMotionPreference)
      window.clearTimeout(milestoneTimer.current)
    }
  }, [])

  useEffect(() => {
    if (milestone) {
      window.clearTimeout(milestoneTimer.current)
      milestoneTimer.current = window.setTimeout(() => setMilestone(''), 2200)
    }
    return () => window.clearTimeout(milestoneTimer.current)
  }, [milestone])

  const drop = useCallback(() => {
    if (phase === 'moving') setPhase('falling')
  }, [phase])

  const handleLand = useCallback((x, baseWidth) => {
    const top = tower[tower.length - 1]
    const supportX = top?.x ?? 0
    const supportWidth = top?.width ?? baseWidth
    const left = Math.max(supportX - supportWidth / 2, x - blockWidth / 2)
    const right = Math.min(supportX + supportWidth / 2, x + blockWidth / 2)
    const overlap = right - left
    const nextScore = score + 1
    if (overlap < blockWidth * 0.15) {
      setPhase('missed')
      return
    }
    // Preserve a readable minimum width so long runs stay playable.
    const playableWidth = Math.max(MIN_BLOCK_WIDTH, overlap)
    const nextBlock = {
      id: nextScore,
      label,
      color,
      width: playableWidth,
      x: (left + right) / 2,
      y: BASE_Y + BASE_HEIGHT / 2 + (score + 0.5) * BLOCK_HEIGHT,
    }
    setTower((current) => [...current, nextBlock].slice(-10))
    setScore(nextScore)
    setBlockWidth(playableWidth)
    setLabel(pickTechnology())
    setPhase('moving')
    const nextCameraShift = Math.max(0, BASE_Y + BASE_HEIGHT / 2 + (nextScore + 0.5) * BLOCK_HEIGHT - 0.25)
    setBurst({ key: nextScore, position: [nextBlock.x, nextBlock.y + 0.2 - nextCameraShift, 0.42] })
    if (nextScore > best) {
      setBest(nextScore)
      try { window.localStorage.setItem('stack-the-tech-best', String(nextScore)) } catch { /* Storage may be unavailable in private browsing. */ }
    }
    if (MILESTONES[nextScore]) setMilestone(MILESTONES[nextScore])
  }, [best, blockWidth, color, label, score, tower])

  const handleMiss = useCallback(() => {
    const remaining = lives - 1
    setLives(remaining)
    if (remaining <= 0) {
      setPhase('over')
      return
    }
    setBlockWidth(tower[tower.length - 1]?.width ?? 3.55)
    setLabel(pickTechnology())
    setPhase('moving')
  }, [lives, tower])

  const restart = () => {
    window.clearTimeout(milestoneTimer.current)
    setScore(0)
    setLives(3)
    setTower([])
    setBlockWidth(3.55)
    setLabel(pickTechnology())
    setMilestone('')
    setBurst(null)
    liveX.current = 0
    setPhase('moving')
    setResetKey((current) => current + 1)
  }

  return (
      <section className="stack-game-panel" aria-labelledby="stack-game-title" aria-describedby="stack-game-instructions">
        <header className="stack-game-header">
          <div className="stack-game-brand">
            <span className="stack-game-kicker">A tiny portfolio arcade</span>
            <h2 id="stack-game-title">STACK <span>THE TECH</span></h2>
            <p id="stack-game-instructions">Time the drop. Build the tallest tech stack.</p>
          </div>
          <div className="stack-game-topline">
            <div className="stack-game-stat"><span>SCORE</span><strong>{score}</strong></div>
            <div className="stack-game-stat"><span>BEST</span><strong>{best}</strong></div>
            <div className="stack-game-lives" aria-label={`${lives} of 3 lives remaining`}>
              <span>LIVES</span><strong aria-hidden="true">{[0, 1, 2].map((life) => <i key={life} className={life < lives ? 'is-alive' : ''}>♥</i>)}</strong>
            </div>
          </div>
        </header>
        <div className={`stack-game-stage ${phase === 'over' ? 'is-over' : ''}`} role="group" tabIndex={0} onClick={drop} aria-label="Game area. Press Space, click, or tap to drop the moving technology block.">
          <Canvas shadows dpr={[1, 1.3]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
            <Suspense fallback={null}>
              <GameScene score={score} phase={phase} tower={tower} label={label} blockWidth={blockWidth} color={color} resetKey={resetKey} liveX={liveX} onLand={handleLand} onMiss={handleMiss} prefersReducedMotion={prefersReducedMotion} />
              {burst && !prefersReducedMotion && <SparkBurst key={burst.key} position={burst.position} />}
            </Suspense>
          </Canvas>
          {milestone && <div className="stack-game-milestone" role="status">{milestone}</div>}
          {phase === 'over' && <div className="stack-game-over">
            <div className="stack-game-over-card">
              <span className="stack-game-kicker">The tower came down</span>
              <h3>GAME OVER</h3>
              <p>Score <strong>{score}</strong><span>Best <strong>{best}</strong></span></p>
              <button type="button" className="stack-game-restart" onClick={restart}>Play again</button>
            </div>
          </div>}
        </div>
        <footer className="stack-game-footer">
          <p><kbd>SPACE</kbd> to drop <span>·</span> or tap the game</p>
          <button type="button" className="stack-game-drop" onClick={drop} disabled={phase !== 'moving'} aria-label={`Drop ${label} block`}>
            DROP <span aria-hidden="true">↓</span>
          </button>
        </footer>
      </section>
  )
}
