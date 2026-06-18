import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

interface PixelRevealProps {
  text: string
  className?: string
  style?: React.CSSProperties
  duration?: number // duration in ms, default 750
}

const CHARS = '░▒▓██▓▒░01X█'

export default function PixelReveal({ text, className, style, duration = 750 }: PixelRevealProps) {
  const [displayText, setDisplayText] = useState('')
  const ref = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    let start: number | null = null
    const targetLength = text.length

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min(1, (timestamp - start) / duration)

      // Calculate how many characters are resolved
      const resolvedCount = Math.floor(progress * targetLength)

      let currentString = ''
      for (let i = 0; i < targetLength; i++) {
        if (i < resolvedCount) {
          // Resolved character
          currentString += text[i]
        } else if (text[i] === ' ') {
          // Keep spaces
          currentString += ' '
        } else {
          // Unresolved character - choose a random block/digital char
          const charIdx = Math.floor(Math.random() * CHARS.length)
          currentString += CHARS[charIdx]
        }
      }

      setDisplayText(currentString)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isInView, text, duration])

  return (
    <h2
      ref={ref}
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {displayText || text.replace(/[^\s]/g, '█')}
    </h2>
  )
}
