import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  style?: React.CSSProperties
  once?: boolean
  threshold?: number
}

/**
 * Splits text into words and reveals each one with a
 * clip-path + translateY wipe, staggered — exactly like Son Daven headings.
 */
export default function TextReveal({
  text,
  className,
  style,
  threshold = 0.2,
}: TextRevealProps) {
  const words = text.split(' ')

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const word = {
    hidden: {
      y: '110%',
      opacity: 0,
    },
    show: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.span
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', ...style }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: threshold }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 1.15 }}
        >
          <motion.span
            variants={word}
            style={{ display: 'inline-block' }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// ─── Parallax wrapper — image moves at different speed than scroll ────────────
interface ParallaxProps {
  children: React.ReactNode
  speed?: number   // 0 = normal, negative = slower (parallax), positive = faster
  style?: React.CSSProperties
}

export function Parallax({ children, speed = -0.2, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }}>
      <motion.div style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  )
}

// ─── Clip-path image wipe reveal ─────────────────────────────────────────────
interface ImageWipeProps {
  src: string
  alt: string
  style?: React.CSSProperties
  delay?: number
}

export function ImageWipe({ src, alt, style, delay = 0 }: ImageWipeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.33, 1, 0.68, 1] }}
      style={{
        overflow: 'hidden',       // clips img to borderRadius
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: 'inherit', // inherits from wrapper
          transition: 'transform 0.6s ease',
        }}
      />
    </motion.div>
  )
}
