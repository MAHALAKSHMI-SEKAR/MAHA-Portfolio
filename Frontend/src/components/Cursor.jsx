import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './cursor.css'

export default function Cursor() {
  const dot = useRef()
  const ring = useRef()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      gsap.set(dot.current, { x: pos.x, y: pos.y })
    }

    const ticker = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      gsap.set(ring.current, { x: ringPos.x, y: ringPos.y })
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, .project-card, input, textarea')) {
        ring.current.classList.add('cursor-ring-active')
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a, button, .project-card, input, textarea')) {
        ring.current.classList.remove('cursor-ring-active')
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    gsap.ticker.add(ticker)

    document.body.classList.add('has-custom-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      gsap.ticker.remove(ticker)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  )
}
