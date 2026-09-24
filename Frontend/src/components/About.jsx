import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import './about.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const root = useRef()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section about" ref={root}>
      <div className="container about-grid">
        <div className="about-reveal">
          <p className="eyebrow">About</p>
          <h2 className="section-title">
            Code that talks to <span className="grad-text">real databases</span>, not just demos.
          </h2>
        </div>

        <div className="about-body">
          <p className="about-reveal about-lead">
            I&rsquo;m {profile.name}, a full stack developer based in {profile.location}. I work across the whole
            stack — React on the frontend, Spring Boot and MySQL underneath, JWT holding the doors shut, and AI
            APIs bolted on when a product needs to understand plain language instead of just form fields.
          </p>

          <p className="about-reveal">
            My path started with a BCA at AVC College and three focused certifications in React, Spring Boot and
            MySQL from Besant Technologies. Since then I&rsquo;ve worked across two teams — building a mobile app
            and real-time dashboards at Ethics Tech, and an eCommerce platform with a Razorpay checkout at
            NathanDynamix. In between, I&rsquo;ve built restaurant, retail and education products on my own,
            including <strong>DineFlow</strong> and <strong>Nathan Lights</strong>.
          </p>

          <div className="about-reveal about-facts">
            <div>
              <span className="about-fact-label">Based in</span>
              <span>{profile.location}</span>
            </div>
            <div>
              <span className="about-fact-label">Focus</span>
              <span>React · Spring Boot · MySQL · AI APIs</span>
            </div>
            <div>
              <span className="about-fact-label">Currently</span>
              <span>Full Stack Developer @ Ethics Tech</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
