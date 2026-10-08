import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import './contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const root = useRef()
  const [sendState, setSendState] = useState('idle')
  const [sendMessage, setSendMessage] = useState('')
  const [fallbackMailto, setFallbackMailto] = useState('')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        opacity: 0, y: 26, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'https://maha-portfolio-a7x7.onrender.com/api/contact'
    setSendState('sending')
    setSendMessage('Sending your message…')
    setFallbackMailto('')

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      })
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || `The mail server returned ${response.status}.`)
      }
      form.reset()
      setSendState('success')
      setSendMessage('Your message was sent. Thank you — I’ll get back to you soon!')
    } catch (error) {
      console.error('Contact form error:', error)
      const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
      const body = encodeURIComponent(`${payload.message}\n\nFrom: ${payload.name}\nEmail: ${payload.email}`)
      setSendState('error')
      setSendMessage(error.name === 'TimeoutError'
        ? 'The mail server took too long to respond. Your message is ready to send directly by email.'
        : 'The mail server could not deliver your message. Your message is ready to send directly by email.')
      setFallbackMailto(`mailto:${profile.email}?subject=${subject}&body=${body}`)
    }
  }

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="glow-blob" style={{ width: 460, height: 460, top: '10%', left: '50%', transform: 'translateX(-50%)', background: '#d7652c', opacity: 0.12 }} />
      <div className="container contact-grid">
        <div>
          <p className="contact-reveal eyebrow">Contact</p>
          <h2 className="contact-reveal section-title">Let&rsquo;s build <span className="grad-text">something real.</span></h2>
          <p className="contact-reveal section-sub">
            Open to full-time roles, freelance builds and collaborations. Tell me what you&rsquo;re working on —
            send me a message here, or reach me directly at {profile.email}.
          </p>
          <div className="contact-reveal contact-links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
        <form className="contact-reveal contact-form" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" required placeholder="Your name" /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5} required placeholder="What are you building?" /></div>
          <p className={`contact-form-status is-${sendState}`} role="status" aria-live="polite">{sendMessage}</p>
          {fallbackMailto && <a className="contact-fallback-link" href={fallbackMailto}>Open a prefilled email</a>}
          <button type="submit" className="btn btn-solid" disabled={sendState === 'sending'}>
            {sendState === 'sending' ? 'Sending…' : sendState === 'success' ? 'Message sent' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
