import { useEffect, useRef, useState } from 'react'
import { profile } from '../content'

const YEAR = new Date().getFullYear()

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copiedTimeout = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimeout.current)
    },
    [],
  )

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.clearTimeout(copiedTimeout.current)
      copiedTimeout.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="content-section contact" id="contact" aria-labelledby="contact-title">
      <p className="story-kicker reveal">Contact</p>
      <h2 className="contact-title reveal" id="contact-title">
        Let's build something <em>memorable.</em>
      </h2>
      <div className="contact-actions reveal">
        <a className="button button--primary" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <button className="button" type="button" onClick={copyEmail}>
          {copied ? 'Copied ✓' : 'Copy email'}
        </button>
      </div>
      <ul className="socials reveal">
        {profile.socials.map((social) => (
          <li key={social.label}>
            <a href={social.href} target="_blank" rel="noreferrer">
              {social.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <footer className="footer">
        <span>
          © {YEAR} {profile.name}
        </span>
        <span>Built with React Three Fiber, GSAP & Lenis</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  )
}
