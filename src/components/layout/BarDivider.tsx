import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BarDividerProps {
  barCount?: number
  height?: number
  color?: string
}

const EDGE_MASK = 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)'

export default function BarDivider({
  barCount = 48,
  height = 140,
  color = 'var(--gold)',
}: BarDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Pre-compute wave heights
  const bars = Array.from({ length: barCount }, (_, i) => {
    const x     = i / barCount
    const sine1 = Math.sin(x * Math.PI) * 0.82
    const sine2 = Math.sin(x * Math.PI * 3) * 0.16
    const noise = Math.sin(x * 17.3 + 2.1) * 0.08 + Math.sin(x * 7.7) * 0.06
    return Math.max(0.08, sine1 + sine2 + noise)
  })

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 6,
        overflow: 'hidden',
        position: 'relative',
        contain: 'strict',
        maskImage: EDGE_MASK,
        WebkitMaskImage: EDGE_MASK,
      }}
    >
      {bars.map((barH, i) => (
        <ScrollBar
          key={i}
          maxHeight={barH * height}
          scrollYProgress={scrollYProgress}
          index={i}
          total={barCount}
          color={color}
        />
      ))}
    </div>
  )
}

function ScrollBar({
  maxHeight,
  scrollYProgress,
  index,
  total,
  color,
}: {
  maxHeight: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
  total: number
  color: string
}) {
  const center   = 0.5
  const distance = Math.abs(index / total - center)
  const start    = 0.1 + distance * 0.15
  const end      = Math.min(start + 0.35, 0.75)

  const scaleY = useTransform(scrollYProgress, [start, end], [0, 1])

  return (
    <motion.div
      style={{
        flex: 1,
        height: maxHeight,
        background: `linear-gradient(180deg, var(--gold-light) 0%, ${color} 35%, rgba(30, 63, 216, 0.14) 75%, transparent 100%)`,
        borderTop: `2px solid var(--gold-light)`,
        borderRadius: '2px 2px 0 0',
        opacity: 0.48,
        transformOrigin: 'bottom',
        scaleY,
        willChange: 'transform',
      }}
    />
  )
}
