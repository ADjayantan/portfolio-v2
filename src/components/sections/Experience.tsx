import { motion } from 'framer-motion'
import { experience, hackathons, certifications } from '../../data/experience'
import type { Recognition } from '../../types'
import PixelReveal from '../layout/PixelReveal'

const monoLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
}

function RecognitionList({ label, items, delay }: { label: string; items: Recognition[]; delay: number }) {
  return (
    <motion.div
      className="exp-col"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      <p style={{ ...monoLabel, letterSpacing: '0.35em', marginBottom: 20 }}>{label}</p>
      {items.map((item, i) => (
        <div
          key={item.title}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 16,
            padding: '16px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            alignItems: 'baseline',
          }}
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400,
              color: 'var(--cream)', letterSpacing: '0.01em', lineHeight: 1.3,
            }}>
              {item.title}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: '0.06em',
              color: 'var(--muted)', lineHeight: 1.7, marginTop: 4,
            }}>
              {item.detail}
            </p>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap',
          }}>
            {item.date}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          02 — Experience
        </motion.p>
        <PixelReveal text="Work & Recognition" className="lx-heading" />

        {/* Roles */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {experience.map((job, i) => (
            <motion.div
              key={job.org}
              className="exp-row"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{
                display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40,
                padding: '32px 0', borderBottom: '1px solid var(--border)',
                alignItems: 'start',
              }}
            >
              <div>
                <p style={monoLabel}>{job.period}</p>
                {job.current && (
                  <p style={{
                    ...monoLabel, color: 'var(--muted)', marginTop: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)',
                      boxShadow: '0 0 8px rgba(201,169,110,0.6)', display: 'inline-block',
                    }} />
                    Current
                  </p>
                )}
              </div>

              <div>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 400, color: 'var(--cream)', letterSpacing: '0.02em', lineHeight: 1.15,
                }}>
                  {job.role}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', letterSpacing: '0.12em',
                  color: 'var(--muted)', marginTop: 8,
                }}>
                  {job.org} · {job.place}
                </p>
                {job.points && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0' }}>
                    {job.points.map((pt) => (
                      <li key={pt} style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.08rem', fontWeight: 300,
                        fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.65,
                        paddingLeft: 22, position: 'relative', marginBottom: 6,
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--gold)', fontStyle: 'normal' }}>—</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hackathons + certifications */}
        <div
          className="exp-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            border: '1px solid var(--border)', marginTop: 64,
          }}
        >
          <RecognitionList label="Hackathons" items={hackathons} delay={0} />
          <RecognitionList label="Certifications" items={certifications} delay={0.1} />
        </div>
      </div>

      <style>{`
        .exp-col { padding: 36px 40px; }
        .exp-col + .exp-col { border-left: 1px solid var(--border); }
        @media (max-width: 680px) {
          .exp-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .exp-grid { grid-template-columns: 1fr !important; }
          .exp-col { padding: 28px 20px; }
          .exp-col + .exp-col { border-left: none; border-top: 1px solid var(--border); }
        }
      `}</style>
    </section>
  )
}
