import { useState } from 'react'
import { profile } from '../content'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="nav"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false)
        }
      }}
    >
      <a className="nav-brand" href="#top" aria-label="Back to top">
        <span className="nav-mark">{profile.brandNative}</span>
        {profile.brand}
      </a>
      <button
        className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        className={`nav-links${menuOpen ? ' is-open' : ''}`}
        id="primary-navigation"
        aria-label="Main"
      >
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a
          className="button button--small"
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Resume
        </a>
      </nav>
    </header>
  )
}
