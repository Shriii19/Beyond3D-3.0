import { profile } from '../content'

export function Nav() {
  return (
    <header className="nav">
      <a className="nav-brand" href="#top" aria-label="Back to top">
        <span className="nav-mark">{profile.brandNative}</span>
        {profile.brand}
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a className="button button--small" href={profile.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
      </nav>
    </header>
  )
}
