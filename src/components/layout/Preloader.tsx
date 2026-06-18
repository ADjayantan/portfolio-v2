import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count,   setCount]   = useState(0)
  const [visible, setVisible] = useState(true)

  // Use ref so the effect never needs onComplete in its dep array
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    const start    = performance.now()
    const duration = 2000
    let rafId: number

    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * 100))

      if (progress < 1) {
        rafId = requestAnimationFrame(raf)
      } else {
        setCount(100)
        // Short pause → fade out & concurrently reveal content to avoid blank screen flash
        setTimeout(() => {
          setVisible(false)
          onCompleteRef.current()
        }, 400)
      }
    }

    rafId = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(rafId)
  }, []) // ✅ Empty deps — runs once only

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              letterSpacing: '0.45em', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 48,
            }}
          >
            Loading portfolio
          </motion.p>

          {/* Big counter */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(5rem, 18vw, 12rem)',
              fontWeight: 300,
              color: 'var(--cream)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              minWidth: '3ch', textAlign: 'center',
            }}>
              {count}
            </p>
            <p style={{
              position: 'absolute', bottom: 12, right: -22,
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              color: 'var(--gold)',
            }}>%</p>
          </div>

          {/* Progress bar */}
          <div style={{
            width: 'min(320px, 70vw)', height: 1,
            background: 'var(--border)', marginTop: 48,
            position: 'relative', overflow: 'hidden',
          }}>
            <motion.div style={{
              position: 'absolute', inset: 0,
              background: 'var(--gold)',
              transformOrigin: 'left',
              scaleX: count / 100,
            }} />
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem',
              fontWeight: 300, color: 'var(--muted)',
              letterSpacing: '0.3em', marginTop: 32, fontStyle: 'italic',
            }}
          >
            AD Jayantan
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
