import { motion } from 'framer-motion'

// Pixel art "< / >" code icon — 11 cols x 7 rows, 0=off 1=on
const CODE_ART = [
  '00000000000',
  '01100001100',
  '00110000110',
  '00011011000',  // < / >
  '00110000110',
  '01100001100',
  '00000000000',
]

// Mountain silhouette bar heights (normalized 0-1)
const MOUNTAIN_BARS = Array.from({ length: 60 }, (_, i) => {
  const x = i / 60
  const h = Math.sin(x * Math.PI) * 0.7
           + Math.sin(x * Math.PI * 4) * 0.15
           + Math.sin(x * Math.PI * 9) * 0.06
           + Math.cos(x * 6.2 + 1.2) * 0.09
  return Math.max(0.03, h)
})

function PixelArt() {
  const COLS = CODE_ART[0].length
  const ROWS = CODE_ART.length
  const SIZE = 5

  return (
    <div style={{ display: 'grid', gridTemplateRows: `repeat(${ROWS}, ${SIZE}px)`, gap: 2, width: 'fit-content', margin: '0 auto 28px' }}>
      {CODE_ART.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`, gap: 2 }}>
          {row.split('').map((cell, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: cell === '1' ? 1 : 0, scaleY: cell === '1' ? 1 : 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: ci * 0.03 + ri * 0.05, ease: [0.33,1,0.68,1] }}
              style={{
                width: SIZE, height: SIZE,
                background: 'var(--gold)',
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function MountainBars() {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end',
      height: 80, width: '100%', overflow: 'hidden',
      marginBottom: 0, opacity: 0.35,
    }}>
      {MOUNTAIN_BARS.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.012, ease: [0.33,1,0.68,1] }}
          style={{
            flex: 1, height: `${h * 80}px`,
            background: 'var(--gold)',
            transformOrigin: 'bottom',
            marginRight: 1,
          }}
        />
      ))}
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      {/* Mountain bar silhouette — Son Daven style */}
      <MountainBars />

      {/* Main footer content */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '56px 40px 40px' }}>

        {/* Pixel art code icon */}
        <PixelArt />

        {/* Large logo text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 300,
            color: 'var(--cream)',
            letterSpacing: '0.12em',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          AD Jayantan
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            textAlign: 'center',
            marginBottom: 48,
          }}
        >
          Frontend Developer · Coimbatore, India
        </motion.p>

        {/* Bottom row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          borderTop: '1px solid var(--border)', paddingTop: 24,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--muted-2)' }}>
            © {year} · All rights reserved
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--muted-2)' }}>
            Built with React + Vite + Framer Motion
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--muted-2)' }}>
            Inspired by Son Daven
          </p>
        </div>
      </div>
    </footer>
  )
}
