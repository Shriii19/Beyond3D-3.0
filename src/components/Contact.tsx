import { useEffect, useRef, useState } from 'react'
import { profile } from '../content'

const YEAR = new Date().getFullYear()

export function Contact() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copiedTimeout = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimeout.current)
    },
    [],
  )

  const copyEmail = async () => {
    window.clearTimeout(copiedTimeout.current)
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('copied')
    } catch (error) {
      console.error('Unable to copy the email address.', error)
      setCopyState('failed')
    }
    copiedTimeout.current = window.setTimeout(() => setCopyState('idle'), 1800)
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
          {copyState === 'copied' ? 'Copied ✓' : copyState === 'failed' ? 'Copy failed' : 'Copy email'}
        </button>
        {copyState !== 'idle' ? (
          <span className="copy-feedback" role="status">
            {copyState === 'copied'
              ? 'Email copied to clipboard.'
              : 'Could not copy. Copy it from the email link.'}
          </span>
        ) : null}
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
