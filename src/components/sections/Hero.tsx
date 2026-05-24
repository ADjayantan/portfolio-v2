import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Code2, Download } from 'lucide-react'
import { profile } from '../../data/profile'

const TAGLINES = ['Frontend Developer', 'Problem Solver', 'DSA Practitioner', 'React Craftsman']
const SOCIALS  = [
  { icon: Github,   href: profile.links.github,  label: 'GitHub'   },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: Code2,    href: profile.links.leetcode, label: 'LeetCode' },
]

// ─── 7×9 pixel maps for every character in "AD Jayantan" ─────────────────────
const PIXEL_MAPS: Record<string, string[]> = {
  A: [
    '0011100',
    '0101010',
    '1000001',
    '1000001',
    '1111111',
    '1000001',
    '1000001',
    '1000001',
    '1000001',
  ],
  D: [
    '1111100',
    '1000010',
    '1000001',
    '1000001',
    '1000001',
    '1000001',
    '1000001',
    '1000010',
    '1111100',
  ],
  J: [
    '0011111',
    '0000100',
    '0000100',
    '0000100',
    '0000100',
    '0000100',
    '1000100',
    '1000100',
    '0111000',
  ],
  a: [
    '0000000',
    '0000000',
    '0111110',
    '1000001',
    '0111111',
    '1000001',
    '1000011',
    '0111101',
    '0000000',
  ],
  y: [
    '0000000',
    '0000000',
    '1000001',
    '1000001',
    '0100010',
    '0010100',
    '0001000',
    '0001000',
    '0110000',
  ],
  n: [
    '0000000',
    '0000000',
    '1011100',
    '1100010',
    '1000010',
    '1000010',
    '1000010',
    '1000010',
    '0000000',
  ],
  t: [
    '0000000',
    '0010000',
    '0010000',
    '1111110',
    '0010000',
    '0010000',
    '0010000',
    '0001110',
    '0000000',
  ],
  ' ': [
    '0000000',
    '0000000',
    '0000000',
    '0000000',
    '0000000',
    '0000000',
    '0000000',
    '0000000',
    '0000000',
  ],
}

const COLS     = 7
const ROWS     = 9
const PX       = 4
const GAP      = 1
const CHAR_GAP = 5

// ─── Canvas pixel renderer ────────────────────────────────────────────────────
interface PixelCanvasProps {
  text: string
  phase: 'enter' | 'hold' | 'exit'
  onExitDone?: () => void
}

function PixelCanvas({ text, phase, onExitDone }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const startRef  = useRef<number | null>(null)

  type Cell = {
    x: number; y: number; on: boolean
    delay: number; scatterX: number; scatterY: number; flicker: number
  }
  const cellsRef = useRef<Cell[]>([])
  const totalWRef = useRef(0)

  const buildCells = useCallback(() => {
    const chars = text.split('')
    const cells: Cell[] = []
    let xOff = 0
    chars.forEach((ch, ci) => {
      const map = PIXEL_MAPS[ch] || PIXEL_MAPS[' ']
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const on = (map[r]?.[c] ?? '0') === '1'
          const waveDist = ci * 0.17 + c * 0.04 + r * 0.012
          cells.push({
            x: xOff + c * (PX + GAP),
            y: r * (PX + GAP),
            on,
            delay:    waveDist,
            scatterX: (Math.random() - 0.5) * 64,
            scatterY: (Math.random() - 0.5) * 44 - 10,
            flicker:  Math.random() * Math.PI * 2,
          })
        }
      }
      xOff += COLS * (PX + GAP) + CHAR_GAP
    })
    cellsRef.current = cells
    totalWRef.current = xOff - CHAR_GAP
  }, [text])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    buildCells()
    canvas.width  = totalWRef.current
    canvas.height = ROWS * (PX + GAP)
    startRef.current = null

    const EXIT_DUR = 0.55

    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = (ts - startRef.current) / 1000

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cells = cellsRef.current

      cells.forEach(cell => {
        const rawP   = Math.max(0, Math.min(1, (elapsed - cell.delay) / 0.45))
        const enterP = 1 - Math.pow(1 - rawP, 3)

        let exitP = 0
        if (phase === 'exit') {
          exitP = Math.min(1, elapsed / EXIT_DUR)
          exitP = exitP * exitP
        }

        const alpha  = cell.on ? enterP * (1 - exitP) : 0
        const scaleY = enterP

        if (alpha < 0.005) {
          if (!cell.on && phase === 'enter' && enterP > 0) {
            ctx.globalAlpha = 0.09
            ctx.fillStyle = '#c9a96e'
            ctx.fillRect(cell.x, cell.y, PX, PX)
            ctx.globalAlpha = 1
          }
          return
        }

        let flickerAlpha = alpha
        if (phase === 'enter' && rawP < 0.55) {
          flickerAlpha = alpha * (0.55 + 0.45 * Math.abs(Math.sin(elapsed * 20 + cell.flicker)))
        }

        const sx = cell.scatterX * exitP
        const sy = cell.scatterY * exitP

        ctx.save()
        ctx.translate(cell.x + sx, cell.y + sy + PX * (1 - scaleY))
        ctx.shadowColor = '#c9a96e'
        ctx.shadowBlur  = flickerAlpha * 8
        ctx.globalAlpha = flickerAlpha
        ctx.fillStyle   = '#c9a96e'
        ctx.fillRect(0, 0, PX, PX * scaleY)
        ctx.restore()
        ctx.globalAlpha = 1
        ctx.shadowBlur  = 0
      })

      if (phase === 'exit' && elapsed >= EXIT_DUR) {
        onExitDone?.()
        return
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text, phase, buildCells, onExitDone])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display:        'block',
        imageRendering: 'pixelated',
        width:          'min(72vw, 720px)',
        height:         'auto',
        margin:         '0 auto',
      }}
    />
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [typing,     setTyping]     = useState(true)

  type NamePhase = 'pixel-enter' | 'pixel-hold' | 'pixel-exit' | 'serif'
  const [namePhase, setNamePhase] = useState<NamePhase>('pixel-enter')

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  // pixel-enter → pixel-hold (after full enter completes ~1.8s)
  useEffect(() => {
    if (namePhase !== 'pixel-enter') return
    const t = setTimeout(() => setNamePhase('pixel-hold'), 1800)
    return () => clearTimeout(t)
  }, [namePhase])

  // pixel-hold → pixel-exit (hold for 1.1s)
  useEffect(() => {
    if (namePhase !== 'pixel-hold') return
    const t = setTimeout(() => setNamePhase('pixel-exit'), 1100)
    return () => clearTimeout(t)
  }, [namePhase])

  const handleExitDone = useCallback(() => setNamePhase('serif'), [])

  const serifVisible = namePhase === 'serif'

  // Typewriter — only runs after serif is shown
  useEffect(() => {
    if (!serifVisible) return
    const target = TAGLINES[taglineIdx]
    const i = displayed.length
    if (typing) {
      if (i < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i + 1)), 65)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(target.slice(0, i - 1)), 35)
        return () => clearTimeout(t)
      } else {
        setTaglineIdx((p) => (p + 1) % TAGLINES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, taglineIdx, serifVisible])

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 64,
      }}
    >
      {/* Ambient orbs */}
      <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: parallaxY }}>
        <div style={{
          position: 'absolute', top: '15%', left: '8%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 68%)',
          animation: 'drift-a 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '18%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,90,160,0.05) 0%, transparent 68%)',
          animation: 'drift-b 24s ease-in-out infinite',
        }} />
      </motion.div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 900, width: '100%' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 40 }}
        >
          Portfolio · 2026 · Coimbatore
        </motion.p>

        {/* ── Name block ── */}
        <div style={{ position: 'relative', marginBottom: 32, minHeight: 110 }}>

          {/* Pixel canvas — full "AD Jayantan" */}
          {(namePhase === 'pixel-enter' || namePhase === 'pixel-hold' || namePhase === 'pixel-exit') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <PixelCanvas
                text="AD Jayantan"
                phase={namePhase === 'pixel-exit' ? 'exit' : namePhase === 'pixel-hold' ? 'hold' : 'enter'}
                onExitDone={handleExitDone}
              />
            </motion.div>
          )}

          {/* Serif reveal after scatter */}
          {serifVisible && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
            >
              <h1 style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'clamp(3rem, 10vw, 7.5rem)',
                fontWeight:    300,
                color:         'var(--cream)',
                letterSpacing: '0.04em',
                lineHeight:    0.95,
                margin:        0,
              }}>
                AD <em style={{ fontStyle: 'italic' }}>Jayantan</em>
              </h1>
            </motion.div>
          )}
        </div>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: serifVisible ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          style={{ width: 80, height: 1, background: 'var(--gold)', opacity: 0.4, margin: '0 auto 28px', transformOrigin: 'left' }}
        />

        {/* Typewriter */}
        <motion.div
          animate={{ opacity: serifVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)',
            color: 'var(--text)', letterSpacing: '0.12em',
            marginBottom: 44, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
          }}
        >
          <span>{displayed}</span>
          <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--gold)' }}>|</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          animate={{ opacity: serifVisible ? 1 : 0, y: serifVisible ? 0 : 12 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}
        >
          <button className="btn-gold" onClick={() => scrollTo('#projects')}>View Work</button>
          <a className="btn-ghost" href={profile.links.resume} download="Jayantan_AD_Resume.pdf"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Download size={12} /> Resume
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div
          animate={{ opacity: serifVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 72 }}
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
              style={{ color: 'var(--muted-2)', transition: 'color 0.2s', display: 'flex' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted-2)')}
            >
              <Icon size={18} strokeWidth={1.5} />
            </a>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          animate={{ opacity: serifVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => scrollTo('#about')}
          style={{
            background: 'none', border: 'none', color: 'var(--muted-2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            animation: 'float-y 3s ease-in-out infinite',
            cursor: 'pointer', margin: '0 auto', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted-2)')}
        >
          <span style={{ fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>scroll</span>
          <ArrowDown size={13} strokeWidth={1.5} />
        </motion.button>

      </div>
    </section>
  )
}
