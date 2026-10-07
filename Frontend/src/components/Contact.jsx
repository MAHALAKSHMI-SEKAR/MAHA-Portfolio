import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import './contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const root = useRef()
  const [emailOpened, setEmailOpened] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

const handleSubmit = (e) => {
  e.preventDefault()

  const form = e.target
  const subject = `Portfolio contact from ${form.name.value}`
  const body = `Name: ${form.name.value}\nEmail: ${form.email.value}\n\n${form.message.value}`
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  window.location.href = mailto
  setEmailOpened(true)
}

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="glow-blob" style={{ width: 460, height: 460, top: '10%', left: '50%', transform: 'translateX(-50%)', background: '#d7652c', opacity: 0.12 }} />
      <div className="container contact-grid">
        <div>
          <p className="contact-reveal eyebrow">Contact</p>
          <h2 className="contact-reveal section-title">
            Let&rsquo;s build <span className="grad-text">something real.</span>
          </h2>
          <p className="contact-reveal section-sub">
            Open to full-time roles, freelance builds and collaborations. Tell me what you&rsquo;re working on —
            your email app will open with your message addressed to {profile.email}.
          </p>

          <div className="contact-reveal contact-links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>

        <form className="contact-reveal contact-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required placeholder="What are you building?" />
          </div>
          <button type="submit" className="btn btn-solid">
            {emailOpened ? 'Email app opened' : 'Continue in email app'}
          </button>
        </form>
      </div>
    </section>
  )
}
