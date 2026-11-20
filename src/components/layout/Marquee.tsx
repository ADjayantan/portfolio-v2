import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface MarqueeProps {
  text: string
  separator?: string
  speed?: number          // px/s base speed
  direction?: 'left' | 'right'
  fontSize?: string
  color?: string
  borderTop?: boolean
  borderBottom?: boolean
}

const EDGE_MASK = 'linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)'

export default function Marquee({
  text,
  separator = '·',
  speed = 60,
  direction = 'left',
  fontSize = 'clamp(1.8rem, 4vw, 3rem)',
  color = 'var(--cream)',
  borderTop = false,
  borderBottom = false,
}: MarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Repeat text enough times to always fill the screen
  const repeated = Array(8).fill(`${text} ${separator} `).join('')

  return (
    <div
      ref={wrapperRef}
      style={{
        overflow: 'hidden',
        padding: '28px 0',
        borderTop:    borderTop    ? '1px solid var(--border)' : undefined,
        borderBottom: borderBottom ? '1px solid var(--border)' : undefined,
        position: 'relative',
        background: 'transparent',
        cursor: 'default',
        userSelect: 'none',
        maskImage: EDGE_MASK,
        WebkitMaskImage: EDGE_MASK,
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}
        animate={{
          x: direction === 'left'
            ? [0, `-${100 / 8}%`]
            : [`-${100 / 8}%`, 0],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize,
            fontWeight: 300,
            fontStyle: 'italic',
            color,
            letterSpacing: '0.04em',
          }}
        >
          {repeated}
        </span>
      </motion.div>
    </div>
  )
}

// ─── Scroll-speed Marquee (speed increases as user scrolls) ─────────────────
interface ScrollMarqueeProps {
  text: string
  separator?: string
}

export function ScrollMarquee({ text, separator = '·' }: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  // Map scroll velocity to x offset — creates "speed boost" effect
  const x = useTransform(scrollYProgress, [0, 1], [0, -200])

  const repeated = Array(8).fill(`${text} ${separator} `).join('')

  return (
    <div
      ref={containerRef}
      style={{
        overflow: 'hidden',
        padding: '24px 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        userSelect: 'none',
        maskImage: EDGE_MASK,
        WebkitMaskImage: EDGE_MASK,
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
          x,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-sm)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          {repeated}
        </span>
      </motion.div>
    </div>
  )
}
