import { about, profile, toolkit } from '../content'

export function About() {
  return (
    <section className="content-section about" id="about" aria-labelledby="about-title">
      <div className="about-intro reveal">
        <p className="story-kicker">About</p>
        <h2 className="section-title" id="about-title">
          {about.statement}
        </h2>
        <p className="about-location">
          {profile.location} · {profile.availability}
        </p>
      </div>
      <div className="about-body">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="about-text reveal">
            {paragraph}
          </p>
        ))}
        <div className="toolkit reveal">
          {toolkit.map((group) => (
            <div key={group.group} className="toolkit-group">
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
