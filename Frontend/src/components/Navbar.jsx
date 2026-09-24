import { useEffect, useState } from 'react'
import './navbar.css'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id) => {
    const section = document.getElementById(id)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    // Close mobile menu
    setOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    setOpen(false)
  }

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">

        {/* Logo */}
        <button
          className="nav-logo"
          onClick={scrollToTop}
          aria-label="Go to top"
        >
          MS<span className="nav-logo-dot">.</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Contact Button */}
        <button
          className="btn btn-solid nav-cta"
          onClick={() => scrollToSection('contact')}
        >
          Let&rsquo;s talk
        </button>

        {/* Mobile Menu Button */}
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`nav-mobile ${open ? 'is-open' : ''}`}>

        {LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
          >
            {link.label}
          </button>
        ))}

        <button
          className="btn btn-solid"
          onClick={() => scrollToSection('contact')}
        >
          Let&rsquo;s talk
        </button>

      </div>
    </header>
  )
}
