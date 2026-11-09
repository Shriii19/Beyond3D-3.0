import { useLenis } from 'lenis/react'
import { lazy, Suspense, useRef } from 'react'
import { projects } from '../content'
import { loadCarousel } from '../lib/assets'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { useAppStore } from '../store/useAppStore'
import { GlitchText } from './GlitchText'

const Carousel = lazy(() => loadCarousel().then((module) => ({ default: module.Carousel })))

const pad = (value: number) => String(value).padStart(2, '0')

// The Work section pins for a while; scrolling turns the 3D carousel one card per step.
export function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const isReady = useAppStore((state) => state.isReady)
  const active = useAppStore((state) => state.workActive)
  const setWorkProgress = useAppStore((state) => state.setWorkProgress)
  const setWorkActive = useAppStore((state) => state.setWorkActive)
  const setWorkVisible = useAppStore((state) => state.setWorkVisible)
  const lenis = useLenis()
  const steps = Math.max(1, projects.length - 1)
  const project = projects[active]

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!isReady || !section) {
        return
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setWorkProgress(self.progress)
          setWorkActive(Math.round(self.progress * steps))
        },
      })
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setWorkVisible(self.isActive),
      })
    },
    { dependencies: [isReady, steps] },
  )

  const goTo = (index: number) => {
    const section = sectionRef.current
    if (!section) {
      return
    }
    // measured from the page, not offsetTop (which is relative to the .content wrapper)
    const top = section.getBoundingClientRect().top + window.scrollY
    const y = top + (index / steps) * (section.offsetHeight - window.innerHeight)
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.2 })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section
      className="work"
      id="work"
      ref={sectionRef}
      aria-labelledby="work-title"
      style={{ height: `${100 + steps * 80}dvh` }}
    >
      <div className="work-sticky">
        <div className="work-stage" aria-hidden="true">
          <Suspense fallback={null}>
            <Carousel />
          </Suspense>
        </div>

        <header className="work-head">
          <p className="story-kicker">Selected work · {pad(projects.length)}</p>
          <h2 className="work-title" id="work-title">
            Things I have built.
          </h2>
        </header>

        <ol className="work-index">
          {projects.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                className={index === active ? 'is-active' : undefined}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => goTo(index)}
              >
                <span>{pad(index + 1)}</span>
                {item.title}
              </button>
            </li>
          ))}
        </ol>

        <article className="work-detail" aria-live="polite">
          <div className="work-counter">
            <span>
              {pad(active + 1)} / {pad(projects.length)}
            </span>
            <span className="work-bar">
              <span style={{ transform: `scaleX(${(active + 1) / projects.length})` }} />
            </span>
          </div>
          <div className="work-detail-body" key={active}>
            <p className="project-meta">
              {project.year} · {project.role}
            </p>
            <h3 className="project-title">
              <GlitchText text={project.title} />
            </h3>
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
                <a
                  href={project.live}
                  target={project.live.startsWith('#') ? undefined : '_blank'}
                  rel="noreferrer"
                >
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

        <p className="work-hint" aria-hidden="true">
          Scroll to browse ↓
        </p>
      </div>
    </section>
  )
}
