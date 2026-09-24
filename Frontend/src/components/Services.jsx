import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../data/content.js'
import './services.css'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="6.5" rx="1.8" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="1.8" />
      <circle cx="7" cy="7.25" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="16.75" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9.5 14.5l5-5M8 7l1.3-1.3a3.5 3.5 0 1 1 5 5L13 12M16 17l-1.3 1.3a3.5 3.5 0 1 1-5-5L11 12" />
    </svg>
  ),
}

export default function Services() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.service-grid', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="section services" ref={root}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Services</p>
          <h2 className="section-title">
            What I can <span className="grad-text">take off your plate</span>
          </h2>
        </div>

        <div className="service-grid">
          {services.map((s) => (
            <div className="service-card" key={s.id}>
              <div className="service-icon">{ICONS[s.icon]}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
