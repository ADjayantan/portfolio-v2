import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Code2, Download } from 'lucide-react'
import { profile } from '../../data/profile'

// ─── constants ────────────────────────────────────────────────────────────────
const TAGLINES = ['Frontend Developer', 'Problem Solver', 'DSA Practitioner', 'React Craftsman']
const SOCIALS  = [
  { icon: Github,   href: profile.links.github,  label: 'GitHub'   },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: Code2,    href: profile.links.leetcode, label: 'LeetCode' },
]

// 7-wide × 9-tall pixel maps
const PM: Record<string, string[]> = {
  A:['0011100','0101010','1000001','1000001','1111111','1000001','1000001','1000001','1000001'],
  D:['1111100','1000010','1000001','1000001','1000001','1000001','1000001','1000010','1111100'],
  J:['0011111','0000100','0000100','0000100','0000100','0000100','1000100','1000100','0111000'],
  a:['0000000','0000000','0111110','1000001','0111111','1000001','1000011','0111101','0000000'],
  y:['0000000','0000000','1000001','1000001','0100010','0010100','0001000','0001000','0110000'],
  n:['0000000','0000000','1011100','1100010','1000010','1000010','1000010','1000010','0000000'],
  t:['0000000','0010000','0010000','1111110','0010000','0010000','0010000','0001110','0000000'],
  ' ':['0000000','0000000','0000000','0000000','0000000','0000000','0000000','0000000','0000000'],
}
const COLS = 7
const ROWS = 9
const GOLD = '#c9a96e'

// ─── types ────────────────────────────────────────────────────────────────────
type AnimPhase = 'enter' | 'hold' | 'exit'
type ExitStyle = 'scatter' | 'implode' | 'rain'

interface Cfg {
  text:     string
  px:       number   // pixel block px
  gap:      number   // gap between pixels
  cGap:     number   // gap between characters
  exit:     ExitStyle
  cssW:     string   // max CSS display width
}

interface Cell {
  x: number; y: number       // canvas coords
  on: boolean
  delay: number              // scan-line stagger (s)
  // random values baked at construction time
  rx: number; ry: number     // scatter / rain vector
  rph: number                // random phase for flicker
}

// ─── build cell list + compute canvas size ────────────────────────────────────
function buildGrid(cfg: Cfg): { cells: Cell[]; w: number; h: number } {
  const { text, px, gap, cGap } = cfg
  const cells: Cell[] = []
  let xOff = 0

  text.split('').forEach((ch, ci) => {
    const map = PM[ch] ?? PM[' ']
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const on = (map[r]?.[c] ?? '0') === '1'
        // stagger: col dominates (left→right scan), row secondary
        const delay = ci * 0.06 + c * 0.028 + r * 0.009
        cells.push({
          x:    xOff + c * (px + gap),
          y:    r    * (px + gap),
          on,
          delay,
          rx:   (Math.random() - 0.5) * 120,
          ry:   (Math.random() - 0.5) * 80 - 20,
          rph:  Math.random() * Math.PI * 2,
        })
      }
    }
    xOff += COLS * (px + gap) + cGap
  })

  return {
    cells,
    w: xOff - cGap,
    h: ROWS * (px + gap),
  }
}

// ─── PixelCanvas ──────────────────────────────────────────────────────────────
// Owns a single canvas and a single rAF loop.
// Phase changes happen in-place: no unmount, no flash.
interface PixelCanvasProps {
  cfg:      Cfg
  phase:    AnimPhase
  onDone?:  () => void   // called when exit animation finishes
}

function PixelCanvas({ cfg, phase, onDone }: PixelCanvasProps) {
  const cvRef     = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)
  const stateRef  = useRef<{
    cells: Cell[]; w: number; h: number
    phase: AnimPhase; startT: number | null
    onDone?: () => void
  } | null>(null)

  // ── initial mount: build grid, size canvas ─────────────────────────────────
  useEffect(() => {
    const cv  = cvRef.current!
    const ctx = cv.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const { cells, w, h } = buildGrid(cfg)

    cv.width  = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    cv.style.width    = '100%'
    cv.style.maxWidth = `${w}px`
    cv.style.height   = 'auto'
    ctx.scale(dpr, dpr)

    stateRef.current = { cells, w, h, phase: 'enter', startT: null, onDone }

    // ── animation loop (never restarts, reads stateRef for phase) ─────────────
    const ENTER_DUR = 0.36   // per-pixel reveal window
    const EXIT_DUR  = 0.58
    const PULSE_HZ  = 0.7    // gentle unified breathing (not per-cell random)

    function loop(ts: number) {
      const s = stateRef.current!
      if (!s.startT) s.startT = ts
      const t = (ts - s.startT) / 1000

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const { cells, phase } = s
      const maxDelay = cells[cells.length - 1].delay   // last cell delay

      // ── scanline beam during enter ─────────────────────────────────────────
      if (phase === 'enter') {
        const totalDur = maxDelay + ENTER_DUR
        const bx = (t / totalDur) * (w + 40) - 20
        const grad = ctx.createLinearGradient(bx - 18, 0, bx + 18, 0)
        grad.addColorStop(0,    'rgba(201,169,110,0)')
        grad.addColorStop(0.35, 'rgba(201,169,110,0.06)')
        grad.addColorStop(0.5,  'rgba(201,169,110,0.22)')
        grad.addColorStop(0.65, 'rgba(201,169,110,0.06)')
        grad.addColorStop(1,    'rgba(201,169,110,0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      // ── hold: unified brightness pulse ─────────────────────────────────────
      const holdBright = phase === 'hold'
        ? 0.80 + 0.20 * Math.sin(t * PULSE_HZ * Math.PI * 2)
        : 1

      // ── exit progress ──────────────────────────────────────────────────────
      const exitP = phase === 'exit'
        ? Math.min(1, (t / EXIT_DUR) ** 2)
        : 0

      // ── cells ──────────────────────────────────────────────────────────────
      const { px } = cfg

      cells.forEach(cell => {
        const raw    = Math.max(0, Math.min(1, (t - cell.delay) / ENTER_DUR))
        // smooth-step enter
        const enterA = raw * raw * (3 - 2 * raw)

        // ghost grid — always visible when not yet lit and not exiting
        if (!cell.on) {
          if (phase !== 'exit') {
            ctx.globalAlpha = 0.055
            ctx.fillStyle   = GOLD
            ctx.fillRect(cell.x, cell.y, px, px)
            ctx.globalAlpha = 1
          }
          return
        }

        // base alpha
        let alpha = enterA * holdBright * (1 - exitP)

        // entry flicker (first 45% of reveal)
        if (phase === 'enter' && raw < 0.45) {
          alpha *= 0.55 + 0.45 * Math.abs(Math.sin(t * 30 + cell.rph))
        }

        if (alpha < 0.008) return

        // exit offset
        let ox = 0, oy = 0
        if (phase === 'exit') {
          const { exit } = cfg
          if (exit === 'scatter') {
            ox = cell.rx * exitP
            oy = cell.ry * exitP
          } else if (exit === 'implode') {
            // collapse to horizontal centre
            ox = (w / 2 - cell.x - px / 2) * exitP * 0.9
            oy = (h / 2 - cell.y - px / 2) * exitP * 0.9
          } else {
            // rain: fall down + fade
            oy = cell.ry * Math.abs(exitP) * 0.6
          }
        }

        // pixel colour — warmer during hold
        const r = Math.round(201 + holdBright * 16)
        const g = Math.round(169 + holdBright * 16)
        const glow = alpha * (phase === 'hold' ? 14 : 7)

        ctx.save()
        ctx.translate(cell.x + ox, cell.y + oy)
        ctx.shadowColor = GOLD
        ctx.shadowBlur  = glow
        ctx.globalAlpha = alpha
        ctx.fillStyle   = `rgb(${r},${g},110)`
        ctx.fillRect(0, 0, px, px)
        ctx.restore()
        ctx.globalAlpha = 1
        ctx.shadowBlur  = 0
      })

      // ── exit done ──────────────────────────────────────────────────────────
      if (phase === 'exit' && t >= EXIT_DUR) {
        s.onDone?.()
        return
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])   // ← intentionally empty: canvas is set up once, phase fed via ref

  // ── phase & onDone changes feed into the loop via ref (no remount) ─────────
  useEffect(() => {
    if (!stateRef.current) return
    stateRef.current.phase  = phase
    stateRef.current.startT = null   // reset timer on phase change
    stateRef.current.onDone = onDone
  }, [phase, onDone])

  return (
    <canvas
      ref={cvRef}
      style={{
        display:        'block',
        imageRendering: 'pixelated',
        maxWidth:       cfg.cssW,
        width:          '100%',
        height:         'auto',
        margin:         '0 auto',
      }}
    />
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
type HeroPhase =
  | 'ad-enter' | 'ad-hold' | 'ad-exit'
  | 'full-enter' | 'full-hold' | 'full-exit'
  | 'serif'

// ── timing (ms) ──
//   AD:   scan max delay ≈ 1*0.06 + 6*0.028 + 8*0.009 = 0.24 + ENTER_DUR 0.36 = 0.60s → hold at 750ms
//   Full: scan max delay ≈ 10*0.06 + 6*0.028 + 8*0.009 = 0.84 + 0.36 = 1.2s → hold at 1400ms
const TIMING = {
  adEnterToHold:   750,
  adHoldDur:      1300,
  fullEnterToHold: 1400,
  fullHoldDur:    1050,
}

const CFG_AD: Cfg   = { text: 'AD',          px: 20, gap: 4, cGap: 32, exit: 'implode', cssW: '380px' }
const CFG_FULL: Cfg = { text: 'AD Jayantan', px:  7, gap: 2, cGap:  9, exit: 'scatter', cssW: '820px' }

export default function Hero() {
  const [heroPhase, setHeroPhase] = useState<HeroPhase>('ad-enter')
  const [tagIdx,    setTagIdx]    = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing,    setTyping]    = useState(true)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])

  // ── phase machine ──────────────────────────────────────────────────────────
  useEffect(() => {
    const map: Partial<Record<HeroPhase, [number, HeroPhase]>> = {
      'ad-enter':   [TIMING.adEnterToHold,   'ad-hold'],
      'ad-hold':    [TIMING.adHoldDur,        'ad-exit'],
      'full-enter': [TIMING.fullEnterToHold,  'full-hold'],
      'full-hold':  [TIMING.fullHoldDur,      'full-exit'],
    }
    const entry = map[heroPhase]
    if (!entry) return
    const [ms, next] = entry
    const t = setTimeout(() => setHeroPhase(next), ms)
    return () => clearTimeout(t)
  }, [heroPhase])

  const onADDone   = useCallback(() => setHeroPhase('full-enter'), [])
  const onFullDone = useCallback(() => setHeroPhase('serif'),      [])

  const serifOn  = heroPhase === 'serif'
  const showAD   = heroPhase.startsWith('ad')
  const showFull = heroPhase.startsWith('full')

  const adPhase: AnimPhase = heroPhase === 'ad-exit'  ? 'exit'
                           : heroPhase === 'ad-hold'  ? 'hold' : 'enter'
  const fullPhase: AnimPhase = heroPhase === 'full-exit' ? 'exit'
                             : heroPhase === 'full-hold' ? 'hold' : 'enter'

  // ── typewriter ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!serifOn) return
    const target = TAGLINES[tagIdx]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(v => target.slice(0, v.length + 1)), 65)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setTyping(false), 1800)
      return () => clearTimeout(t)
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(v => v.slice(0, -1)), 35)
        return () => clearTimeout(t)
      }
      // Wrap in setTimeout to avoid calling setState synchronously within the effect
      const t = setTimeout(() => {
        setTagIdx(i => (i + 1) % TAGLINES.length)
        setTyping(true)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [displayed, typing, tagIdx, serifOn])

  const goTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative',
        overflow: 'hidden', paddingTop: 64,
      }}
    >
      {/* ── background orbs ── */}
      <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: bgY }}>
        <div style={{
          position: 'absolute', top: '12%', left: '6%',
          width: 560, height: 560, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.065) 0%, transparent 65%)',
          animation: 'drift-a 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '16%', right: '8%',
          width: 440, height: 440, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,80,160,0.045) 0%, transparent 65%)',
          animation: 'drift-b 26s ease-in-out infinite',
        }} />
      </motion.div>

      {/* ── content ── */}
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '0 20px', maxWidth: 920, width: '100%',
      }}>

        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.5em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: 44,
          }}
        >
          Portfolio · 2026 · Coimbatore
        </motion.p>

        {/* ── pixel / serif name block ── */}
        <div style={{
          position: 'relative', marginBottom: 36,
          minHeight: 148,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>

          {/* Phase 1 — AD big, implode out */}
          {showAD && (
            <div style={{ position: 'absolute', width: '100%' }}>
              <PixelCanvas cfg={CFG_AD} phase={adPhase} onDone={onADDone} />
            </div>
          )}

          {/* Phase 2 — full name, scatter out */}
          {showFull && (
            <div style={{ position: 'absolute', width: '100%' }}>
              <PixelCanvas cfg={CFG_FULL} phase={fullPhase} onDone={onFullDone} />
            </div>
          )}

          {/* Phase 3 — serif reveal */}
          {serifOn && (
            <motion.div
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            >
              <h1 style={{
                fontFamily:    'var(--font-serif)',
                fontSize:      'clamp(3.2rem, 10.5vw, 8rem)',
                fontWeight:    300,
                color:         'var(--cream)',
                letterSpacing: '0.045em',
                lineHeight:    0.92,
                margin:        0,
              }}>
                AD{' '}<em style={{ fontStyle: 'italic' }}>Jayantan</em>
              </h1>
            </motion.div>
          )}
        </div>

        {/* gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: serifOn ? 1 : 0, opacity: serifOn ? 0.45 : 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            width: 88, height: 1, background: 'var(--gold)',
            margin: '0 auto 30px', transformOrigin: 'left',
          }}
        />

        {/* typewriter */}
        <motion.div
          animate={{ opacity: serifOn ? 1 : 0, y: serifOn ? 0 : 6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.72rem, 1.7vw, 0.92rem)',
            color: 'var(--text)', letterSpacing: '0.14em',
            marginBottom: 48, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
          }}
        >
          <span>{displayed}</span>
          <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--gold)' }}>|</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          animate={{ opacity: serifOn ? 1 : 0, y: serifOn ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}
        >
          <button className="btn-gold" onClick={() => goTo('#projects')}>
            View Work
          </button>
          <a
            className="btn-ghost"
            href={profile.links.resume}
            download="Jayantan_AD_Resume.pdf"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Download size={12} /> Resume
          </a>
        </motion.div>

        {/* socials */}
        <motion.div
          animate={{ opacity: serifOn ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          style={{ display: 'flex', gap: 22, justifyContent: 'center', marginBottom: 76 }}
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
              style={{ color: 'var(--muted-2)', transition: 'color 0.22s', display: 'flex' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted-2)')}
            >
              <Icon size={18} strokeWidth={1.4} />
            </a>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.button
          animate={{ opacity: serifOn ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          onClick={() => goTo('#about')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted-2)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 7,
            margin: '0 auto', transition: 'color 0.22s',
            animation: 'float-y 3s ease-in-out infinite',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted-2)')}
        >
          <span style={{
            fontSize: '8px', letterSpacing: '0.38em',
            textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
          }}>scroll</span>
          <ArrowDown size={13} strokeWidth={1.4} />
        </motion.button>
      </div>
    </section>
  )
}
