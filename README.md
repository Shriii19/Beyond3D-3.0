# Beyond3D 3.0 — SHREE

A scroll-driven portfolio built around a 3D typographic story. Gold letters drift across the opening scene, then the letters in **SHREE** gather into a word as you scroll. Project work, an about section, and contact details follow.

## Features

- **Interactive 3D typography:** Glyphs are built from Space Grotesk font outlines and rendered as beveled, metallic geometry.
- **Responsive alphabet field:** The complete alphabet, including the extra E in SHREE, is placed in a seeded layout that adapts to wide and tall screens.
- **Scroll-driven motion:** Lenis and GSAP ScrollTrigger synchronize the 3D introduction and pinned project carousel with page scrolling.
- **3D project carousel:** Project cards move through a cover-flow layout, with animated titles and visual effects.
- **Optimized rendering:** The 3D experience loads separately from the page content and stops rendering after the introduction leaves view.
- **Accessible fallback:** Visitors who prefer reduced motion or whose browser does not support WebGL get a static presentation and a regular project grid.
- **No downloaded HDR environment:** Studio lighting is created in the scene.

## Built with

React 19 · TypeScript · Vite · three.js · React Three Fiber · drei · `@react-three/postprocessing` · GSAP · Lenis · Zustand

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The site runs in a modern browser. WebGL is used for the immersive experience; reduced-motion preferences and browsers without WebGL use the static fallback instead.

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run oxlint
```

## Personalizing the portfolio

Update the profile, skills, toolkit, story, about copy, and project data in [`src/content.ts`](src/content.ts). Replace values marked `REPLACE`, including the example name, location, email, social links, and project details.

- Add a resume at `public/resume.pdf` and update the `resume` value if needed.
- Put project images in `public/` and set each project's `image` to a root-relative path, such as `/project-shot.jpg`.
- Update the page title and metadata in [`index.html`](index.html) when changing the portfolio identity.

## Project structure

```text
src/
  content.ts          Profile, portfolio copy, skills, and project data
  components/         Page sections, navigation, scroll behavior, and fallback UI
  experience/         Three.js scene, typography, lighting, carousel, and timeline
  lib/                Asset loading, geometry, feature detection, and shared utilities
  store/              Shared scroll and experience state
public/               Static assets, icons, and fonts
```
