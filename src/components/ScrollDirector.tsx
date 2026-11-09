import { useLenis } from 'lenis/react'
import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useAppStore } from '../store/useAppStore'

export function ScrollDirector() {
  const isReady = useAppStore((state) => state.isReady)
  const immersive = useAppStore((state) => state.immersive)
  const setScrollProgress = useAppStore((state) => state.setScrollProgress)
  const setChapter = useAppStore((state) => state.setChapter)
  const setIntroVisible = useAppStore((state) => state.setIntroVisible)

  useLenis(() => {
    ScrollTrigger.update()
  })

  // Must run before the triggers below measure the page, so it's a layout effect declared first.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('is-ready', isReady)
    document.body.classList.toggle('is-ready', isReady)
    document.documentElement.classList.toggle('is-static', !immersive)
  }, [isReady, immersive])

  useGSAP(
    () => {
      if (!isReady) {
        return
      }

      ScrollTrigger.refresh()

      ScrollTrigger.create({
        trigger: '.story',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
        onUpdate: (self) => setScrollProgress(self.progress),
      })

      // Once the content arrives the scene stops rendering and the HUD hides.
      ScrollTrigger.create({
        trigger: '.content',
        start: 'top 85%',
        onEnter: () => setIntroVisible(false),
        onLeaveBack: () => setIntroVisible(true),
      })

      gsap.utils.toArray<HTMLElement>('.story-section').forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setChapter(index),
          onEnterBack: () => setChapter(index),
        })
      })

      // Hand over from the 3D intro to the content sections.
      gsap.to('.stage-3d', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.content', start: 'top 85%', end: 'top 25%', scrub: true },
      })

      if (!immersive) {
        return
      }

      gsap.from(['.nav', '.hero-line'], {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })

      // Story copy sticks below the word (see .story-copy in CSS). It fades in as its
      // section arrives and out before the section end pushes it up into the word.
      gsap.utils.toArray<HTMLElement>('.story-section').forEach((section) => {
        const copy = section.querySelector<HTMLElement>('.story-copy, .hero-copy')
        if (!copy) {
          return
        }
        const isHero = copy.classList.contains('hero-copy')

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: () => {
            const rect = section.getBoundingClientRect()
            const vh = window.innerHeight
            const fadeIn = isHero ? 1 : gsap.utils.clamp(0, 1, (vh * 0.95 - rect.top) / (vh * 0.35))
            const fadeOut = isHero
              ? gsap.utils.clamp(0, 1, (rect.bottom - vh * 0.5) / (vh * 0.4))
              : gsap.utils.clamp(0, 1, (rect.bottom - vh * 0.9) / (vh * 0.2))
            gsap.set(copy, {
              opacity: Math.min(fadeIn, fadeOut),
              y: (1 - fadeIn) * 40 - (1 - fadeOut) * 30,
            })
          },
        })
      })

      gsap.set('.reveal', { opacity: 0 })
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 },
          ),
      })
    },
    { dependencies: [isReady, immersive] },
  )

  return null
}
