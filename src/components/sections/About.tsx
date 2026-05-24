import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import TextReveal, { Parallax, ImageWipe } from '../layout/TextReveal'

const DETAILS = [
  { label: 'Degree',   value: profile.degree },
  { label: 'College',  value: profile.college },
  { label: 'Location', value: profile.location },
  { label: 'Company',  value: `${profile.company} — Intern` },
  { label: 'Focus',    value: 'Web Dev + DSA + Java' },
  { label: 'Status',   value: 'Open to opportunities' },
]

export default function About() {
  return (
    <section id="about" className="lx-section">
      <div className="lx-container">

        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          01 — About
        </motion.p>

        {/* Word-reveal pull quote */}
        <blockquote style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--cream)',
          lineHeight: 1.25,
          letterSpacing: '0.02em',
          maxWidth: 780,
          marginBottom: 72,
          borderLeft: '2px solid rgba(201,169,110,0.25)',
          paddingLeft: 32,
        }}>
          <TextReveal
            text="I design structured frontend systems and sharpen problem-solving through consistent, disciplined DSA practice."
            threshold={0.1}
          />
        </blockquote>

        {/* Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, alignItems: 'start' }}
          className="about-grid"
        >
          {/* Photo — wipe reveal (Parallax removed: overflow:hidden clips image and breaks IntersectionObserver) */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 200, height: 260 }}>
              <ImageWipe
                src={`${import.meta.env.BASE_URL}profile.png`}
                alt="AD Jayantan"
                style={{ width: 200, height: 260, border: '1px solid var(--border-light)' }}
              />
            </div>
            {/* Gold corner accent */}
            <div style={{
              position: 'absolute', bottom: -8, right: -8,
              width: 40, height: 40,
              border: '1px solid var(--gold)', opacity: 0.4,
              pointerEvents: 'none',
            }} />
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--muted)', marginTop: 14,
            }}>
              AD Jayantan
            </p>
          </div>

          {/* Detail rows */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr',
                  gap: 24, padding: '18px 0',
                  borderBottom: i < DETAILS.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'baseline',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px',
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: 'var(--gold)', opacity: 0.8, flexShrink: 0,
                }}>
                  {d.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                  fontWeight: 300, color: 'var(--cream)',
                  letterSpacing: '0.01em', lineHeight: 1.4,
                }}>
                  {d.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
