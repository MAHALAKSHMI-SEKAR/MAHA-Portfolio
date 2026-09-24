import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { faqs } from '../data/content.js'
import './faq.css'

gsap.registerPlugin(ScrollTrigger)

function FaqItem({ item, isOpen, onToggle }) {
  const panel = useRef()

  useLayoutEffect(() => {
    if (!panel.current) return
    if (isOpen) {
      gsap.to(panel.current, { height: 'auto', duration: 0.45, ease: 'power2.out' })
    } else {
      gsap.to(panel.current, { height: 0, duration: 0.35, ease: 'power2.inOut' })
    }
  }, [isOpen])

  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="faq-icon">
          <span />
          <span />
        </span>
      </button>
      <div className="faq-panel" ref={panel}>
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const root = useRef()
  const [openIndex, setOpenIndex] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.faq-list', start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" className="section faq" ref={root}>
      <div className="container faq-grid">
        <div className="section-head faq-head">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">
            Questions I get <span className="grad-text">a lot</span>
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
