import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience, education, certifications } from '../data/content.js'
import './experience.css'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          x: -24,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%' },
        })
      })

      gsap.from('.edu-card', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.edu-grid', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="section experience" ref={root}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">
            Where I&rsquo;ve <span className="grad-text">put in the hours</span>
          </h2>
        </div>

        <div className="timeline">
          {experience.map((job, i) => (
            <div className="timeline-item" key={job.id}>
              <div className="timeline-marker">
                <span className="timeline-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="timeline-line" />
              </div>
              <div className="timeline-content">
                <div className="timeline-top">
                  <h3>{job.role}</h3>
                  <span className="timeline-period">{job.period}</span>
                </div>
                <p className="timeline-company">
                  {job.company} · {job.location}
                </p>
                <ul>
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="edu-block">
          <h3 className="edu-heading">Education & certifications</h3>
          <div className="edu-grid">
            {education.map((e) => (
              <div className="edu-card" key={e.id}>
                <span className="edu-period">{e.period}</span>
                <h4>{e.credential}</h4>
                <p>{e.school}</p>
                <span className="edu-detail">{e.detail}</span>
              </div>
            ))}
            <div className="edu-card edu-card-certs">
              <span className="edu-period">Besant Technologies</span>
              <h4>Certifications</h4>
              <ul>
                {certifications.map((c) => (
                  <li key={c}>{c.replace(' — Besant Technologies', '')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
