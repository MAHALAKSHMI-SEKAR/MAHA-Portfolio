import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '../data/content.js'
import './skills.css'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = ['Frontend', 'Backend', 'Database', 'Language', 'AI', 'Tools', 'Integrations']

export default function Skills() {
  const root = useRef()
  const marquee = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marquee.current, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
        repeat: -1,
      })

      gsap.from('.skill-card', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skill-groups', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" className="section skills" ref={root}>
      <div className="marquee-wrap">
        <div className="marquee-track" ref={marquee}>
          {[...skills, ...skills].map((s, i) => (
            <span className="marquee-item" key={i}>
              {s.name} <em>•</em>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title">
            The toolkit behind <span className="grad-text">every build</span>
          </h2>
          <p className="section-sub">
            One stack, end to end — I pick these up in nearly every project, from schema design to the pixels on
            screen.
          </p>
        </div>

        <div className="skill-groups">
          {GROUPS.map((group) => {
            const items = skills.filter((s) => s.group === group)
            if (!items.length) return null
            return (
              <div className="skill-card" key={group}>
                <h3>{group}</h3>
                <ul>
                  {items.map((s) => (
                    <li key={s.name}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
