// Everything a visitor reads lives here. Replace the placeholder values
// (marked "REPLACE") with your own details — no other file needs to change.

export type Project = {
  title: string
  year: string
  role: string
  summary: string
  impact: string
  tags: string[]
  live?: string
  code?: string
  image?: string
}

export const profile = {
  brand: 'SHREE',
  brandNative: 'श्री',
  name: 'Your Name', // REPLACE
  role: 'Creative Frontend Developer',
  tagline: 'I build 3D, motion-rich websites with React, Three.js and AI.',
  location: 'Your City, India', // REPLACE
  availability: 'Open to frontend & creative developer roles',
  email: 'you@example.com', // REPLACE
  resume: '/resume.pdf', // REPLACE: drop your resume.pdf into /public
  socials: [
    { label: 'GitHub', href: 'https://github.com/your-username' }, // REPLACE
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-username' }, // REPLACE
  ],
}

export const skills = [
  'React',
  'TypeScript',
  'Three.js',
  'React Three Fiber',
  'GSAP',
  'WebGL',
  'Tailwind',
  'Node.js',
  'AI APIs',
  'Figma',
]

export const toolkit = [
  { group: 'Frontend', items: ['React', 'TypeScript', 'Vite', 'HTML / CSS', 'Tailwind'] },
  { group: '3D & Motion', items: ['Three.js', 'React Three Fiber', 'GSAP', 'Lenis', 'Blender'] },
  { group: 'AI & Tools', items: ['AI APIs', 'Prompt design', 'Git', 'Figma'] },
]

export const story = {
  fragments: {
    kicker: '02 / Fragments',
    title: 'Every build starts in pieces.',
    text: 'Twenty-six letters, endless options. Ideas, code, motion and 3D mean little until someone picks the right ones.',
  },
  assembled: {
    kicker: '03 / Assembled',
    title: 'I pick what matters.',
    text: 'Then I join those pieces into one experience that feels built, not stitched together.',
  },
  complete: {
    kicker: '04 / Complete',
    title: 'And make it shine.',
    text: 'Shree means radiance, and that is the bar every project has to clear.',
  },
}

export const about = {
  statement: 'I turn ideas into websites people remember.',
  paragraphs: [
    // REPLACE with your own story — keep it short and specific.
    'I am a frontend developer who loves the space where code meets motion. I design and build interactive 3D experiences with React, Three.js and GSAP, and I use AI tools to move from idea to working prototype fast.',
    'Beyond3D 3.0 is my third website. Each one taught me something new, and this one is where performance, storytelling and craft finally come together.',
  ],
}

export const projects: Project[] = [
  {
    title: 'Beyond3D 3.0',
    year: '2026',
    role: 'Design & development',
    summary:
      'This site. A scroll-driven 3D story where the letters of SHREE are picked out of a floating alphabet and assemble into one word.',
    impact: 'Real extruded 3D type, bloom post-processing and a static fallback for reduced motion.',
    tags: ['React Three Fiber', 'GSAP', 'Lenis', 'TypeScript'],
    live: '#top',
    code: 'https://github.com/your-username/beyond3d', // REPLACE
  },
  {
    // REPLACE with your second website
    title: 'Your second website',
    year: '2025',
    role: 'Solo developer',
    summary: 'One line on what it is and who it is for.',
    impact: 'One line on the result: speed, users, a feature you are proud of.',
    tags: ['React', 'Three.js'],
    live: 'https://example.com',
    code: 'https://github.com/your-username/project-two',
  },
  {
    // REPLACE with your first website
    title: 'Your first website',
    year: '2025',
    role: 'Solo developer',
    summary: 'One line on what it is and who it is for.',
    impact: 'One line on what you learned or achieved.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    live: 'https://example.com',
    code: 'https://github.com/your-username/project-one',
  },
]
