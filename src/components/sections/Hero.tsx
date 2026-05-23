import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Code2, Download } from 'lucide-react'
import { profile } from '../../data/profile'

const TAGLINES = ['Frontend Developer', 'Problem Solver', 'DSA Practitioner', 'React Craftsman']
const SOCIALS  = [
  { icon: Github,   href: profile.links.github,  label: 'GitHub'   },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: Code2,    href: profile.links.leetcode, label: 'LeetCode' },
]

// ─── Bar-built letter renderer ────────────────────────────────────────────────
const LETTER_MAPS: Record<string, string[]> = {
  A: ['01110','10001','11111','10001','10001'],
  D: ['11110','10001','10001','10001','11110'],
  J: ['00111','00010','00010','10010','01100'],
  Y: ['10001','01010','00100','00100','00100'],
  N: ['10001','11001','10101','10011','10001'],
  T: ['11111','00100','00100','00100','00100'],
  a: ['01110','00001','01111','10001','01111'],
  n: ['00000','01110','10001','10001','10001'],
  ' ': ['00000','00000','00000','00000','00000'],
}

function BarLetter({ char, progress }: { char: string; progress: number }) {
  const map = LETTER_MAPS[char] || LETTER_MAPS[' ']
  const COLS = 5
  const ROWS = map.length

  return (
    <div style={{ display: 'inline-flex', gap: 2, marginRight: 6 }}>
      {Array.from({ length: COLS }, (_, col) => {
        // Count active rows in this column
        let activeRows = 0
        for (let row = 0; row < ROWS; row++) {
          if (map[row]?.[col] === '1') activeRows++
        }
        const colHeight = (activeRows / ROWS) * 100 * progress
        const isActive  = map.some((r) => r[col] === '1')

        return (
          <div
            key={col}
            style={{
              width: 3,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {Array.from({ length: ROWS }, (_, row) => {
              const on = map[ROWS - 1 - row]?.[col] === '1'
              return (
                <motion.div
                  key={row}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: on && progress > 0 ? 1 : 0 }}
                  transition={{
                    duration: 0.4,
                    delay: on ? (col * 0.06 + row * 0.03) : 0,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{
                    width: '100%',
                    height: 6,
                    background: on ? 'var(--cream)' : 'transparent',
                    transformOrigin: 'bottom',
                    opacity: on ? 1 : 0,
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function BarText({ text, progress }: { text: string; progress: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
      {text.split('').map((char, i) => (
        <BarLetter key={i} char={char} progress={progress} />
      ))}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [typing,     setTyping]     = useState(true)
  const [barProgress, setBarProgress] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  // Animate bars in on mount
  useEffect(() => {
    const t = setTimeout(() => {
      let p = 0
      const iv = setInterval(() => {
        p += 0.04
        setBarProgress(Math.min(p, 1))
        if (p >= 1) clearInterval(iv)
      }, 30)
      return () => clearInterval(iv)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  // Typewriter
  useEffect(() => {
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
  }, [displayed, typing, taglineIdx])

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

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
      {/* Ambient orbs — parallax on scroll */}
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
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 860, width: '100%' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 36 }}
        >
          Portfolio · 2026 · Coimbatore
        </motion.p>

        {/* Bar-built name — "AD Jayantan" assembled from vertical bars */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 16 }}
        >
          {/* Large serif name behind the bars — revealed when bars fully appear */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Bar version fades out, serif fades in */}
            <motion.div
              animate={{ opacity: barProgress >= 1 ? 0 : 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformOrigin: 'center' }}
            >
              <div style={{ transform: 'scale(clamp(1, 4vw, 2.2))', transformOrigin: 'center bottom' }}>
                <BarText text="AD" progress={barProgress} />
              </div>
            </motion.div>

            <motion.h1
              animate={{ opacity: barProgress >= 1 ? 1 : 0, y: barProgress >= 1 ? 0 : 10 }}
              transition={{ duration: 0.7 }}
              style={{
                position: barProgress >= 1 ? 'relative' : 'absolute',
                inset: barProgress >= 1 ? 'auto' : 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(5rem, 14vw, 10rem)',
                fontWeight: 300,
                color: 'var(--cream)',
                letterSpacing: '0.04em',
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              AD
            </motion.h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <motion.div
              animate={{ opacity: barProgress >= 1 ? 0 : 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div style={{ transform: 'scale(clamp(0.8, 2.5vw, 1.6))', transformOrigin: 'center bottom' }}>
                <BarText text="Jayantan" progress={barProgress} />
              </div>
            </motion.div>

            <motion.h1
              animate={{ opacity: barProgress >= 1 ? 1 : 0, y: barProgress >= 1 ? 0 : 10 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                position: barProgress >= 1 ? 'relative' : 'absolute',
                inset: barProgress >= 1 ? 'auto' : 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(5rem, 14vw, 10rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--cream)',
                letterSpacing: '0.04em',
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              Jayantan
            </motion.h1>
          </div>
        </motion.div>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ width: 80, height: 1, background: 'var(--gold)', opacity: 0.4, margin: '0 auto 28px', transformOrigin: 'left' }}
        />

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
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
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
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
