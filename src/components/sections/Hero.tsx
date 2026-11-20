import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Code2, Download } from 'lucide-react'
import { profile } from '../../data/profile'
import { leetcodeStats } from '../../data/stats'

// ─── constants ────────────────────────────────────────────────────────────────
const TAGLINES = [
  profile.title,
  profile.stack,
  'SWE Intern @ Havonz',
  `${leetcodeStats.total} LeetCode problems solved`,
]
const SOCIALS = [
  { icon: Github,   href: profile.links.github,   label: 'GitHub'   },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: Code2,    href: profile.links.leetcode, label: 'LeetCode' },
]

// Matches the ReactBits Gradient ASCII luminance character ramp (?characters=+.·•●)
const ASCII_RAMP = ['.', '·', '•', '●'] as const

interface HeroChar {
  char: string
  italic: boolean
  isSpace: boolean
}

const HERO_CHARS: HeroChar[] = [
  { char: 'A', italic: false, isSpace: false },
  { char: 'D', italic: false, isSpace: false },
  { char: ' ', italic: false, isSpace: true  },
  { char: 'J', italic: true,  isSpace: false },
  { char: 'a', italic: true,  isSpace: false },
  { char: 'y', italic: true,  isSpace: false },
  { char: 'a', italic: true,  isSpace: false },
  { char: 'n', italic: true,  isSpace: false },
  { char: 't', italic: true,  isSpace: false },
  { char: 'a', italic: true,  isSpace: false },
  { char: 'n', italic: true,  isSpace: false },
]

const CHAR_STAGGER_MS = 65
const CHAR_DECODE_MS  = 520
const TOTAL_DECODE_MS = (HERO_CHARS.length - 1) * CHAR_STAGGER_MS + CHAR_DECODE_MS

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const [elapsed,   setElapsed]   = useState(() => (reduceMotion ? TOTAL_DECODE_MS : 0))
  const [tick,      setTick]      = useState(0)
  const [tagIdx,    setTagIdx]    = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing,    setTyping]    = useState(true)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])

  // ── ASCII Dot-Matrix Decode timer ──────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion) return
    const start = performance.now()
    let raf = 0
    let lastTick = 0

    const loop = (now: number) => {
      const dt = now - start
      setElapsed(Math.min(dt, TOTAL_DECODE_MS))
      // Advance glyph scramble tick at ~24fps matching GradientASCII shader grain/flicker
      if (now - lastTick > 42) {
        lastTick = now
        setTick((t) => t + 1)
      }
      if (dt < TOTAL_DECODE_MS) {
        raf = requestAnimationFrame(loop)
      }
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  const effectiveElapsed = reduceMotion ? TOTAL_DECODE_MS : elapsed
  const decodeReady = effectiveElapsed >= TOTAL_DECODE_MS * 0.55

  // ── typewriter ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!decodeReady) return
    const target = TAGLINES[tagIdx]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed((v) => target.slice(0, v.length + 1)), 65)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setTyping(false), 1800)
      return () => clearTimeout(t)
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed((v) => v.slice(0, -1)), 35)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => {
        setTagIdx((i) => (i + 1) % TAGLINES.length)
        setTyping(true)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [displayed, typing, tagIdx, decodeReady])

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
          background: 'radial-gradient(circle, rgba(30,63,216,0.09) 0%, transparent 65%)',
          animation: 'drift-a 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '16%', right: '8%',
          width: 440, height: 440, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)',
          animation: 'drift-b 26s ease-in-out infinite',
        }} />
      </motion.div>

      {/* ── content ── */}
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '0 20px', maxWidth: 920, width: '100%',
      }}>

        {/* status pill — the first thing a recruiter needs to know */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          style={{ marginBottom: 40 }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '8px 18px', borderRadius: 999,
            border: '1px solid var(--gold-border)', background: 'var(--header-bg)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(5, 7, 15, 0.32)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)',
            letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--cream)',
          }}>
            <span aria-hidden="true" style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)',
              animation: 'pulse-dot 2.2s ease-out infinite', flexShrink: 0,
            }} />
            Open to internships<span className="hero-pill-loc"> · Coimbatore, IN</span>
          </span>
        </motion.p>

        {/* ── ASCII Dot-Matrix Decode → Editorial Serif Heading ── */}
        <div style={{
          position: 'relative', marginBottom: 36,
          minHeight: 132,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <h1 style={{
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(3.2rem, 10.5vw, 8rem)',
            fontWeight:    300,
            color:         'var(--cream)',
            letterSpacing: '0.045em',
            lineHeight:    0.95,
            margin:        0,
            textShadow:    '0 4px 32px rgba(5, 7, 15, 0.45)',
          }}>
            <span className="sr-only">AD Jayantan</span>
            <span aria-hidden="true">
              {HERO_CHARS.map((item, idx) => {
                if (item.isSpace) {
                  return <span key={idx} style={{ display: 'inline-block', width: '0.28em' }}>{' '}</span>
                }

                const charStart = idx * CHAR_STAGGER_MS
                const rawProgress = (effectiveElapsed - charStart) / CHAR_DECODE_MS
                const progress = Math.max(0, Math.min(1, rawProgress))

                // Smooth ease-out curve for the target serif letter reveal
                const serifProgress = Math.max(0, Math.min(1, (progress - 0.32) / 0.68))
                const easedSerif = 1 - Math.pow(1 - serifProgress, 3)

                // ASCII dot-matrix glyph (' .·•●') rises in luminance then dissolves as the serif letter locks in
                const glyphVisible = progress < 0.92
                const rampIndex = Math.min(
                  ASCII_RAMP.length - 1,
                  Math.floor(progress * ASCII_RAMP.length + ((tick + idx * 3) % 2) * 0.6),
                )
                const dotChar = ASCII_RAMP[Math.max(0, rampIndex)]
                const dotOpacity = progress < 0.15
                  ? 0.25 + (progress / 0.15) * 0.75
                  : Math.max(0, 1 - Math.pow((progress - 0.25) / 0.67, 2))

                const blurPx = (1 - easedSerif) * 10
                const bloomGlow = serifProgress > 0 && serifProgress < 0.95
                  ? `0 0 ${Math.round((1 - serifProgress) * 28)}px rgba(165, 216, 255, ${(1 - serifProgress) * 0.85})`
                  : '0 4px 32px rgba(5, 7, 15, 0.45)'

                return (
                  <span
                    key={idx}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      fontStyle: item.italic ? 'italic' : 'normal',
                    }}
                  >
                    {/* Target serif character (always in layout flow so kerning/width never shifts) */}
                    <span
                      style={{
                        display: 'inline-block',
                        opacity: easedSerif,
                        filter: blurPx > 0.15 ? `blur(${blurPx.toFixed(1)}px)` : 'none',
                        transform: `translateY(${((1 - easedSerif) * 10).toFixed(1)}px) scale(${(0.94 + easedSerif * 0.06).toFixed(3)})`,
                        textShadow: bloomGlow,
                        willChange: progress < 1 ? 'transform, opacity, filter' : 'auto',
                      }}
                    >
                      {item.char}
                    </span>

                    {/* Overlay ASCII dot-matrix glyph (. · • ●) that morphs into the letter */}
                    {glyphVisible && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontStyle: 'normal',
                          fontSize: '0.52em',
                          color: progress > 0.45 ? 'var(--cream)' : 'var(--gold)',
                          opacity: dotOpacity,
                          transform: `scale(${(0.85 + progress * 0.45).toFixed(2)})`,
                          textShadow: '0 0 18px rgba(56, 189, 248, 0.85), 0 0 34px rgba(165, 216, 255, 0.5)',
                          pointerEvents: 'none',
                        }}
                      >
                        {dotChar}
                      </span>
                    )}
                  </span>
                )
              })}
            </span>
          </h1>
        </div>

        {/* accent rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.55 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          style={{
            width: 88, height: 1, background: 'var(--gold)',
            margin: '0 auto 30px', transformOrigin: 'center',
          }}
        />

        {/* typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.72rem, 1.7vw, 0.92rem)',
            color: 'var(--text)', letterSpacing: '0.14em',
            marginBottom: 48, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>{displayed}</span>
          <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--gold)' }}>|</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}
        >
          <a
            className="btn-solid"
            href={profile.links.resume}
            download="Jayantan_AD_Resume.pdf"
          >
            <Download size={13} strokeWidth={2} /> Resume
          </a>
          <button className="btn-gold" onClick={() => goTo('#projects')}>
            View Work
          </button>
        </motion.div>

        {/* socials */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{ display: 'flex', gap: 22, justifyContent: 'center', marginBottom: 76 }}
        >
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
              style={{ color: 'var(--muted)', transition: 'color 0.22s', display: 'flex' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >
              <Icon size={18} strokeWidth={1.4} />
            </a>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          aria-label="Scroll to About"
          onClick={() => goTo('#about')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 7,
            margin: '0 auto', transition: 'color 0.22s',
            animation: 'float-y 3s ease-in-out infinite',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
        >
          <span style={{
            fontSize: 'var(--fs-2xs)', letterSpacing: '0.38em',
            textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
          }}>scroll</span>
          <ArrowDown size={13} strokeWidth={1.4} />
        </motion.button>
      </div>
      <style>{`@media (max-width: 480px) { .hero-pill-loc { display: none; } }`}</style>
    </section>
  )
}
