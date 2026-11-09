import { create } from 'zustand'
import { canUseWebGL, prefersReducedMotion } from '../lib/support'

type AppState = {
  progress: number
  isReady: boolean
  scrollProgress: number
  chapter: number
  introVisible: boolean
  // false when the device has no WebGL or the visitor asked for less motion
  immersive: boolean
  // Work carousel: scroll progress through the section, the project in front, and whether it is on screen
  workProgress: number
  workActive: number
  workVisible: boolean
  setProgress: (progress: number) => void
  setReady: (isReady: boolean) => void
  setScrollProgress: (scrollProgress: number) => void
  setChapter: (chapter: number) => void
  setIntroVisible: (introVisible: boolean) => void
  setWorkProgress: (workProgress: number) => void
  setWorkActive: (workActive: number) => void
  setWorkVisible: (workVisible: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  progress: 0,
  isReady: false,
  scrollProgress: 0,
  chapter: 0,
  introVisible: true,
  immersive: canUseWebGL() && !prefersReducedMotion(),
  workProgress: 0,
  workActive: 0,
  workVisible: false,
  setProgress: (progress) => set({ progress }),
  setReady: (isReady) => set({ isReady }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setChapter: (chapter) => set({ chapter }),
  setIntroVisible: (introVisible) => set({ introVisible }),
  setWorkProgress: (workProgress) => set({ workProgress }),
  setWorkActive: (workActive) => set({ workActive }),
  setWorkVisible: (workVisible) => set({ workVisible }),
}))
