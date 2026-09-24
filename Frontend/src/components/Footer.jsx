import { profile } from '../data/content.js'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="nav-logo">
          MS<span className="nav-logo-dot">.</span>
        </span>
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, R3F & GSAP.
        </p>
        <div className="footer-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}
