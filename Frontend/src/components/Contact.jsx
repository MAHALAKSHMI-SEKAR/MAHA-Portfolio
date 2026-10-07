import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import { profile } from '../data/content.js'
import './contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const root = useRef()
  const [sendState, setSendState] = useState('idle')
  const [sendMessage, setSendMessage] = useState('')

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

  const form = e.currentTarget
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    setSendState('error')
    setSendMessage(`The contact form is not configured yet. Email me directly at ${profile.email}.`)
    return
  }

  setSendState('sending')
  setSendMessage('Sending your message…')

  try {
    await emailjs.sendForm(serviceId, templateId, form, { publicKey })
    form.reset()
    setSendState('success')
    setSendMessage('Your message was sent. Thank you — I’ll get back to you soon!')
  } catch (error) {
    console.error('EmailJS contact form error:', error)
    setSendState('error')
    setSendMessage(`Your message could not be sent. Please try again or email ${profile.email} directly.`)
  }
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
            send me a message here, or reach me directly at {profile.email}.
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
          <p className={`contact-form-status is-${sendState}`} role="status" aria-live="polite">
            {sendMessage}
          </p>
          <button type="submit" className="btn btn-solid" disabled={sendState === 'sending'}>
            {sendState === 'sending' ? 'Sending…' : sendState === 'success' ? 'Message sent' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
