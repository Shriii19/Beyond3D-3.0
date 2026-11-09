import { profile, skills, story } from '../content'

export function Story() {
  return (
    <main className="story" id="top">
      <section className="story-section story-section--hero" data-chapter="hello">
        <div className="hero-copy">
          <p className="story-kicker hero-line">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability}
          </p>
          <h1 className="hero-name hero-line">{profile.name}</h1>
          <p className="hero-role hero-line">{profile.role}</p>
          <p className="story-text hero-line">{profile.tagline}</p>
          <div className="hero-actions hero-line">
            <a className="button button--primary" href="#work">
              View my work
            </a>
            <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
              Resume
            </a>
          </div>
        </div>
        <a className="skip-intro" href="#work">
          Skip intro ↓
        </a>
      </section>

      <section className="story-section story-section--fragments" data-chapter="fragments">
        <div className="story-copy">
          <p className="story-kicker">{story.fragments.kicker}</p>
          <h2 className="story-title">{story.fragments.title}</h2>
          <p className="story-text">{story.fragments.text}</p>
          <ul className="chips" aria-label="Skills">
            {skills.map((skill) => (
              <li key={skill} className="chip">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="story-section story-section--assembled" data-chapter="assembled">
        <div className="story-copy">
          <p className="story-kicker">{story.assembled.kicker}</p>
          <h2 className="story-title">{story.assembled.title}</h2>
          <p className="story-text">{story.assembled.text}</p>
        </div>
      </section>

      <section className="story-section story-section--complete" data-chapter="complete">
        <div className="story-copy">
          <p className="story-kicker">{story.complete.kicker}</p>
          <h2 className="story-title">{story.complete.title}</h2>
          <p className="story-text">{story.complete.text}</p>
        </div>
      </section>
    </main>
  )
}
