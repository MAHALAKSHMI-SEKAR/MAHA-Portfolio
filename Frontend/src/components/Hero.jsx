import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Hero3D from './Hero3D.jsx'
import { profile, stats } from '../data/content.js'
import './hero.css'

export default function Hero() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.set('.hero-line span', { yPercent: 120 })
        .set('.hero-fade', { opacity: 0, y: 18 })
        .to('.hero-canvas', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.1)
        .to('.hero-line span', { yPercent: 0, duration: 1, stagger: 0.09 }, 0.25)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.5')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={root}>
      <div className="glow-blob" style={{ width: 520, height: 520, top: '-10%', right: '-8%', background: '#7c3aed' }} />
      <div className="glow-blob" style={{ width: 420, height: 420, bottom: '-14%', left: '-6%', background: '#22d3ee', opacity: 0.3 }} />
      <div className="noise-grid" />

      <Hero3D />

      <div className="container hero-inner">
        <p className="hero-fade eyebrow">Full Stack Developer · Chennai, India</p>

        <h1 className="hero-title">
          <span className="hero-line">
            <span>Hi, I&rsquo;m Mahalakshmi —</span>
          </span>
          <span className="hero-line">
            <span className="grad-text">I build things</span>
          </span>
          <span className="hero-line">
            <span>that ship.</span>
          </span>
        </h1>

        <p className="hero-fade hero-desc">{profile.summary}</p>

        <div className="hero-fade hero-actions">
          <a href="#work" className="btn btn-solid">
            See my work
          </a>
          <a href="#contact" className="btn btn-outline">
            Get in touch
          </a>
        </div>

        {/* <div className="hero-fade hero-stats">
          {stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div> */}
      </div>

      <div className="hero-scroll hero-fade" aria-hidden="true">
        <span />
        scroll
      </div>
    </section>
  )
}
