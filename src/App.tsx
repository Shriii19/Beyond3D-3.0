import { ReactLenis } from 'lenis/react'
import { lazy, Suspense, type ReactNode } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { ScrollDirector } from './components/ScrollDirector'
import { StaticStage } from './components/StaticStage'
import { Story } from './components/Story'
import { Work } from './components/Work'
import { loadExperience } from './lib/assets'
import { chapterName } from './lib/chapters'
import { useAppStore } from './store/useAppStore'

const Experience = lazy(() => loadExperience().then((module) => ({ default: module.Experience })))

function SmoothScroll({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  if (!enabled) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1.1, autoRaf: true, anchors: true }}
    >
      {children}
    </ReactLenis>
  )
}

export default function App() {
  const immersive = useAppStore((state) => state.immersive)

  return (
    <SmoothScroll enabled={immersive}>
      <div className="stage-3d">{immersive ? (
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        ) : (
          <StaticStage />
        )}</div>
      <Nav />
      <Story />
      <div className="content">
        <Work />
        <About />
        <Contact />
      </div>
      <ScrollDirector />
      <Loader />
      <ScrollHud />
    </SmoothScroll>
  )
}

function ScrollHud() {
  const isReady = useAppStore((state) => state.isReady)
  const introVisible = useAppStore((state) => state.introVisible)
  const chapter = useAppStore((state) => state.chapter)
  const scrollProgress = useAppStore((state) => state.scrollProgress)

  if (!isReady || !introVisible) {
    return null
  }

  return (
    <div className="hud" aria-hidden="true">
      <span>
        {String(chapter + 1).padStart(2, '0')} · {chapterName(chapter)}
      </span>
      <span className="hud-bar">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </span>
    </div>
  )
}
