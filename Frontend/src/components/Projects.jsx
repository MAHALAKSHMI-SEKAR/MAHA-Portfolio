import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/content.js'
import './projects.css'

gsap.registerPlugin(ScrollTrigger)

function ProjectCard({ project, index }) {
  const card = useRef()

  const handleMove = (e) => {
    const el = card.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.5,
      ease: 'power2.out',
    })
    gsap.to(el.querySelector('.project-glow'), {
      x: x * 60,
      y: y * 60,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' })
  }

  return (
    <article
      className="project-card"
      ref={card}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--accent': project.color }}
    >
      <div className="project-glow" style={{ background: project.glow }} />

      <div className="project-top">
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="tag">{project.tag}</span>
      </div>

      <h3 className="project-name">{project.name}</h3>
      <p className="project-desc">{project.description}</p>

      <ul className="project-highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="project-stack">
        {project.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <p className="project-based">Based on: {project.basedOn}</p>
    </article>
  )
}

export default function Projects() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-grid', start: 'top 78%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" className="section projects" ref={root}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2 className="section-title">
            Products I&rsquo;ve <span className="grad-text">built end to end</span>
          </h2>
          <p className="section-sub">
            From database schema to the last pixel — three full-stack builds, each with a real admin surface and
            a real payment or AI integration behind it.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
