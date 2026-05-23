import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorX  = useMotionValue(-100)
  const cursorY  = useMotionValue(-100)
  const trailX   = useMotionValue(-100)
  const trailY   = useMotionValue(-100)
  const isHover  = useRef(false)
  const scaleVal = useMotionValue(1)

  const springX = useSpring(trailX, { stiffness: 120, damping: 20 })
  const springY = useSpring(trailY, { stiffness: 120, damping: 20 })
  const scale   = useSpring(scaleVal, { stiffness: 200, damping: 18 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const enterHover = () => { isHover.current = true;  scaleVal.set(2.2) }
    const leaveHover = () => { isHover.current = false; scaleVal.set(1)   }

    const hoverTargets = 'a, button, [data-cursor-hover]'

    window.addEventListener('mousemove', move)

    const attach = () => {
      document.querySelectorAll<HTMLElement>(hoverTargets).forEach((el) => {
        el.addEventListener('mouseenter', enterHover)
        el.addEventListener('mouseleave', leaveHover)
      })
    }

    attach()
    const interval = setInterval(attach, 2000) // re-attach for dynamically added elements

    return () => {
      window.removeEventListener('mousemove', move)
      clearInterval(interval)
    }
  }, [cursorX, cursorY, trailX, trailY, scaleVal])

  return (
    <>
      {/* Dot — snaps to cursor */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0, top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--gold)',
          zIndex: 99998,
          pointerEvents: 'none',
        }}
      />

      {/* Ring — springs behind */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0, top: 0,
          x: springX,
          y: springY,
          scale,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.5)',
          zIndex: 99997,
          pointerEvents: 'none',
          boxShadow: '0 0 12px rgba(201,169,110,0.12)',
        }}
      />

      {/* Ambient glow orb — very subtle, large */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0, top: 0,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)',
          zIndex: 99996,
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @media (hover: none) { /* hide on touch devices */
          [data-cursor] { display: none !important; }
        }
        * { cursor: none !important; }
      `}</style>
    </>
  )
}
