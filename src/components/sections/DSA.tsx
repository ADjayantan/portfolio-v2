import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { leetcodeStats } from '../../data/stats'
import { profile } from '../../data/profile'

interface StatItem {
  value: number | string
  label: string
  sub: string
  isText?: boolean
}

const STATS: StatItem[] = [
  { value: leetcodeStats.total,         label: 'Problems Solved',  sub: `Easy ${leetcodeStats.easy} · Med ${leetcodeStats.medium} · Hard ${leetcodeStats.hard}` },
  { value: leetcodeStats.maxStreak,     label: 'Day Streak',       sub: '100 Days Badge 2026' },
  { value: leetcodeStats.contestRating, label: 'Contest Rating',   sub: 'Top 59% globally' },
  { value: leetcodeStats.activeDays,    label: 'Active Days',      sub: 'Total days with submissions' },
  { value: leetcodeStats.badges,        label: 'Badges Earned',    sub: 'LeetCode achievements' },
  { value: 'Daily',                     label: 'Practice Cadence', sub: 'Arrays, Trees, Recursion', isText: true },
]

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const steps = 60
    const step  = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target, duration, start])
  return count
}

function StatCard({ stat, delay, triggered }: { stat: StatItem; delay: number; triggered: boolean }) {
  const count = useCountUp(
    typeof stat.value === 'number' ? stat.value : 0,
    1400,
    triggered && !stat.isText,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay }}
      style={{
        padding: '48px 32px',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 24, height: 1,
        background: 'var(--gold)', opacity: 0.35,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 1, height: 24,
        background: 'var(--gold)', opacity: 0.35,
      }} />

      {/* Big number */}
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3rem, 6vw, 5rem)',
        fontWeight: 300,
        color: 'var(--cream)',
        letterSpacing: '-0.01em',
        lineHeight: 1,
        marginBottom: 10,
      }}>
        {stat.isText ? stat.value : (triggered ? count.toLocaleString() : '0')}
      </p>

      {/* Label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: 8,
      }}>
        {stat.label}
      </p>

      {/* Sub */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--muted)',
        letterSpacing: '0.08em',
      }}>
        {stat.sub}
      </p>
    </motion.div>
  )
}

export default function DSA() {
  const sectionRef = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="dsa" className="lx-section" ref={sectionRef}>
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          03 — DSA Practice
        </motion.p>
        <motion.h2
          className="lx-heading"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          The Numbers
        </motion.h2>

        {/* Stats grid — 3 cols */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid var(--border)',
            borderRight: 'none',
            borderBottom: 'none',
          }}
          className="dsa-grid"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 0.1} triggered={triggered} />
          ))}
        </div>

        {/* LeetCode link */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={profile.links.leetcode}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '9px' }}
          >
            View LeetCode Profile <ExternalLink size={11} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .dsa-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 420px) {
          .dsa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
