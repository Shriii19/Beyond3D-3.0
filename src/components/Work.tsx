import { projects, type Project } from '../content'
import { useAppStore } from '../store/useAppStore'
import { WorkCarousel } from './WorkCarousel'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className={`project reveal${index === 0 ? ' project--featured' : ''}`}>
      <div className="project-media" aria-hidden="true">
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" />
        ) : (
          <span className="project-number">{number}</span>
        )}
      </div>
      <div className="project-body">
        <p className="project-meta">
          {project.year} · {project.role}
        </p>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <p className="project-impact">
          <span>Result</span>
          {project.impact}
        </p>
        <ul className="chips chips--small" aria-label="Built with">
          {project.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
        <div className="project-links">
          {project.live ? (
            <a href={project.live} target={project.live.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
              Live site ↗
            </a>
          ) : null}
          {project.code ? (
            <a href={project.code} target="_blank" rel="noreferrer">
              Source code ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

// Static card grid: used when there is no WebGL or the visitor prefers reduced motion.
function WorkGrid() {
  return (
    <section className="content-section" id="work" aria-labelledby="work-title">
      <header className="section-head reveal">
        <p className="story-kicker">Selected work · {String(projects.length).padStart(2, '0')}</p>
        <h2 className="section-title" id="work-title">
          Things I have built.
        </h2>
      </header>
      <div className="projects">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

export function Work() {
  const immersive = useAppStore((state) => state.immersive)
  return immersive ? <WorkCarousel /> : <WorkGrid />
}
