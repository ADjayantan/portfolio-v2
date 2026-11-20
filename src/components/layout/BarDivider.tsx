import { motion } from 'framer-motion'

interface BarDividerProps {
  barCount?: number
  height?: number
  color?: string
}

const DOT_SEQUENCE = ['.', '·', '•', '●', '•', '·', '.'] as const

export default function BarDivider({
  height = 72,
  color = 'var(--gold)',
}: BarDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height,
        maxWidth: 1080,
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        position: 'relative',
      }}
    >
      {/* Left fading hairline */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, var(--border-light) 45%, ${color} 100%)`,
          opacity: 0.45,
        }}
      />

      {/* Centered ASCII dot-matrix motif (. · • ● • · .) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: 1,
          color: 'var(--gold-light)',
          textShadow: '0 0 12px rgba(56, 189, 248, 0.55)',
          userSelect: 'none',
        }}
      >
        {DOT_SEQUENCE.map((ch, idx) => (
          <span
            key={idx}
            style={{
              opacity: idx === 3 ? 0.95 : idx === 2 || idx === 4 ? 0.7 : 0.45,
            }}
          >
            {ch}
          </span>
        ))}
      </motion.div>

      {/* Right fading hairline */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${color} 0%, var(--border-light) 55%, transparent 100%)`,
          opacity: 0.45,
        }}
      />
    </div>
  )
}
