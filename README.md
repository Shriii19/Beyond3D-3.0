# Beyond3D 3.0 — SHREE

A scroll-driven 3D portfolio. The whole alphabet floats in gold 3D type; as you scroll, S, H, R, E and E are picked out and fly together into **SHREE** while the other letters drift away. Below the intro sit the projects, about and contact sections.

<!-- Add a GIF or screenshot here: ![Preview](docs/preview.gif) -->

## Highlights

- **Real 3D type.** The letters are extruded from the Space Grotesk font outlines (opentype.js → three.js `ExtrudeGeometry`) with bevels and a physical gold material.
- **Alphabet field.** All 26 letters (plus the repeated E) are laid out on a seeded, jittered grid that keeps clear of the nav and hero copy on any screen shape.
- **3D work carousel.** The Work section pins while you scroll and turns a cover-flow of gold-framed 3D cards, one project per step. Project titles scramble in with an RGB-split glitch, colour channels split as the carousel moves, and a light film grain sits over the whole page.
- **Scroll storytelling.** Lenis smooth scroll drives GSAP ScrollTrigger, which feeds one progress value into a small stage timeline (`src/experience/timeline.ts`).
- **Post-processing.** Bloom, ACES tone mapping and a vignette, plus a studio environment built from Lightformers, with no HDR download.
- **Fast first paint.** three.js and the font parser load as separate chunks, and the scene stops rendering once the intro scrolls away.
- **Accessible fallback.** With `prefers-reduced-motion` or no WebGL, the site shows a static layout with real HTML text throughout.

## Tech

React 19 · TypeScript · Vite · three.js · React Three Fiber · drei · @react-three/postprocessing · GSAP · Lenis · Zustand

## Make it yours

All visitor-facing text lives in [`src/content.ts`](src/content.ts): name, role, email, links, skills, story copy and projects. Lines marked `REPLACE` are placeholders. Put your resume at `public/resume.pdf` and project screenshots in `public/` (set `image: '/your-shot.jpg'` on a project).

## Run it

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`. `npm run lint` runs oxlint.

## Structure

```
src/
  content.ts            all copy and project data
  components/           HTML layer: Nav, Story, Work, About, Contact, Loader, ScrollDirector
  experience/           3D layer: Scene, ShreeWord (alphabet + word), Halo, Carousel, Studio, timeline
  lib/                  font/glyph loading, pointer tracking, feature detection
  store/useAppStore.ts  shared state between scroll and scene
```
