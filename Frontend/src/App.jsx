import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Navbar from './components/Navbar.jsx'
import Cursor from './components/Cursor.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Experience from './components/Experience.jsx'
import Services from './components/Services.jsx'
import FAQ from './components/FAQ.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const progress = useRef()

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight)
      gsap.to(progress.current, { scaleX: scrolled, duration: 0.1, ease: 'none' })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="scroll-progress" ref={progress} />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Services />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
