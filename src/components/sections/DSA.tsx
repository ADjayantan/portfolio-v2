import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { leetcodeStats, githubStats } from '../../data/stats'
import { profile } from '../../data/profile'
import PixelReveal from '../layout/PixelReveal'

interface StatItem {
  value: number | string
  label: string
  sub: string
  isText?: boolean
}

const STATS: StatItem[] = [
  { value: leetcodeStats.total,         label: 'Problems Solved',  sub: `Easy ${leetcodeStats.easy} · Med ${leetcodeStats.medium} · Hard ${leetcodeStats.hard}` },
  { value: leetcodeStats.contestRating, label: 'Contest Rating',   sub: `Top ${leetcodeStats.topPercentage}% · ${leetcodeStats.contestsAttended} contests` },
  { value: leetcodeStats.maxStreak,     label: 'Max Streak (days)', sub: `${leetcodeStats.activeDays} active days in the past year` },
  { value: leetcodeStats.javaSolved,    label: 'Solved in Java',   sub: 'Primary DSA language' },
  { value: leetcodeStats.badges,        label: 'LeetCode Badges',  sub: leetcodeStats.badgeNames.join(' · ') || 'Annual badges' },
  { value: githubStats.repos,           label: 'Public Repos',     sub: 'Open source on GitHub' },
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

const breakdownLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
}

function Breakdown() {
  const { easy, medium, hard, topTopics } = leetcodeStats
  const total = easy + medium + hard || 1
  const segments = [
    { label: 'Easy', value: easy, opacity: 0.35 },
    { label: 'Medium', value: medium, opacity: 0.7 },
    { label: 'Hard', value: hard, opacity: 1 },
  ]

  return (
    <div className="dsa-breakdown">
      {/* Difficulty split */}
      <div className="dsa-breakdown-cell">
        <p style={breakdownLabel}>Difficulty split</p>
        <div
          role="img"
          aria-label={`Easy ${easy}, Medium ${medium}, Hard ${hard}`}
          style={{ display: 'flex', gap: 3, height: 8, margin: '20px 0 16px' }}
        >
          {segments.map((seg, i) => (
            <motion.div
              key={seg.label}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: seg.value, minWidth: 6, background: 'var(--gold)',
                opacity: seg.opacity, transformOrigin: 'left',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {segments.map((seg) => (
            <span key={seg.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--muted)',
            }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, background: 'var(--gold)', opacity: seg.opacity }} />
              {seg.label}
              <strong style={{ color: 'var(--cream)', fontWeight: 400 }}>{seg.value}</strong>
              <span>{Math.round((seg.value / total) * 100)}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Strongest topics */}
      <div className="dsa-breakdown-cell">
        <p style={breakdownLabel}>Strongest topics</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
          {topTopics.map((t) => (
            <span key={t.tag} className="lx-chip" style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.06em' }}>
              {t.tag}
              <span style={{ color: 'var(--cream)' }}>{t.solved}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
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
        fontSize: 'var(--fs-xs)',
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
        fontSize: 'var(--fs-xs)',
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
          04 — DSA Practice
        </motion.p>
        <PixelReveal text="The Numbers" className="lx-heading" />

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

        <Breakdown />

        {/* LeetCode link */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={profile.links.leetcode}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-xs)' }}
          >
            View LeetCode Profile <ExternalLink size={11} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <style>{`
        .dsa-breakdown {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--border);
          border-top: none;
        }
        .dsa-breakdown-cell { padding: 36px 32px; }
        .dsa-breakdown-cell + .dsa-breakdown-cell { border-left: 1px solid var(--border); }
        @media (max-width: 680px) {
          .dsa-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dsa-breakdown { grid-template-columns: 1fr; }
          .dsa-breakdown-cell { padding: 28px 20px; }
          .dsa-breakdown-cell + .dsa-breakdown-cell { border-left: none; border-top: 1px solid var(--border); }
        }
        @media (max-width: 420px) {
          .dsa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
