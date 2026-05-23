import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorX  = useMotionValue(-100)
  const cursorY  = useMotionValue(-100)
  const trailX   = useMotionValue(-100)
  const trailY   = useMotionValue(-100)
  const scaleVal = useMotionValue(1)

  const springX = useSpring(trailX, { stiffness: 150, damping: 22 })
  const springY = useSpring(trailY, { stiffness: 150, damping: 22 })
  const scale   = useSpring(scaleVal, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const enterHover = () => scaleVal.set(2.2)
    const leaveHover = () => scaleVal.set(1)

    const attach = () => {
      document.querySelectorAll<HTMLElement>('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', enterHover)
        el.addEventListener('mouseleave', leaveHover)
      })
    }

    window.addEventListener('mousemove', move, { passive: true })
    attach()
    const interval = setInterval(attach, 2000)

    return () => {
      window.removeEventListener('mousemove', move)
      clearInterval(interval)
    }
  }, [cursorX, cursorY, trailX, trailY, scaleVal])

  return (
    <>
      {/* Dot — snaps exactly to cursor */}
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0,
          x: cursorX, y: cursorY,
          translateX: '-50%', translateY: '-50%',
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--gold)',
          zIndex: 99998, pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* Ring — springs behind cursor */}
      <motion.div
        style={{
          position: 'fixed', left: 0, top: 0,
          x: springX, y: springY,
          scale,
          translateX: '-50%', translateY: '-50%',
          width: 30, height: 30, borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.5)',
          zIndex: 99997, pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      <style>{`
        @media (hover: none) { * { cursor: auto !important; } }
        @media (hover: hover) { * { cursor: none !important; } }
      `}</style>
    </>
  )
}
