import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface BarDividerProps {
  barCount?: number
  height?: number
  color?: string
}

export default function BarDivider({
  barCount = 80,
  height = 180,
  color = 'var(--gold)',
}: BarDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bars = Array.from({ length: barCount }, (_, i) => {
    const x    = i / barCount
    const sine1 = Math.sin(x * Math.PI) * 0.85
    const sine2 = Math.sin(x * Math.PI * 3) * 0.15
    const noise = Math.sin(x * 17.3 + 2.1) * 0.08 + Math.sin(x * 7.7) * 0.06
    return Math.max(0.04, sine1 + sine2 + noise)
  })

  return (
    <div
      ref={ref}
      style={{
        width: '100%', height,
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden', position: 'relative',
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

// ─── Each bar is its own component so hooks are called at component level ─────
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

  // ✅ Hook at component top level — not inside map
  const scaleY = useTransform(scrollYProgress, [start, end], [0, 1])

  return (
    <motion.div
      style={{
        flex: 1,
        height: maxHeight,
        background: color,
        opacity: 0.55,
        transformOrigin: 'bottom',
        scaleY,
        marginRight: 1,
      }}
    />
  )
}
