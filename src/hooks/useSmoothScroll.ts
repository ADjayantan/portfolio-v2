import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,                          // was 1.35 — too sluggish
      easing: (t: number) => 1 - Math.pow(1 - t, 3),   // simpler cubic ease-out
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])
}
