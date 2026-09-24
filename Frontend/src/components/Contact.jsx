import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import './contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const root = useRef()
  const [sent, setSent] = useState(false)

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

  const handleSubmit = async (e) => {
  e.preventDefault()

  const form = e.target

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  }

  try {
    const response = await fetch('http://localhost:8080/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    setSent(true)
    form.reset()

    setTimeout(() => {
      setSent(false)
    }, 4000)

  } catch (error) {
    console.error(error)
    alert('Failed to send message. Please try again.')
  }
}

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="glow-blob" style={{ width: 460, height: 460, top: '10%', left: '50%', transform: 'translateX(-50%)', background: '#ff3ea5', opacity: 0.25 }} />
      <div className="container contact-grid">
        <div>
          <p className="contact-reveal eyebrow">Contact</p>
          <h2 className="contact-reveal section-title">
            Let&rsquo;s build <span className="grad-text">something real.</span>
          </h2>
          <p className="contact-reveal section-sub">
            Open to full-time roles, freelance builds and collaborations. Tell me what you&rsquo;re working on —
            I&rsquo;ll get back to you at {profile.email}.
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
            {sent ? 'Message sent ✓' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
