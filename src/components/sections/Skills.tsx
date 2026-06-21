import { motion } from 'framer-motion'
import { skills, levelColors } from '../../data/skills'
import PixelReveal from '../layout/PixelReveal'

interface SkillDotProps {
  color: string
  glow?: boolean
}

function SkillDot({ color, glow = false }: SkillDotProps) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        boxShadow: glow ? `0 0 8px ${color}40` : undefined,
      }}
    />
  )
}

interface SkillRowProps {
  name: string
  level: 'core' | 'proficient' | 'familiar'
  showBorder: boolean
}

function SkillRow({ name, level, showBorder }: SkillRowProps) {
  const color = levelColors[level] ?? 'var(--muted)'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: showBorder ? '1px solid var(--border)' : 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          fontWeight: 300,
          color: 'var(--cream)',
          letterSpacing: '0.01em',
        }}
      >
        {name}
      </span>
      <SkillDot color={color} glow />
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          04 — Stack
        </motion.p>
        <PixelReveal text="Tech & Tools" className="lx-heading" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0',
            border: '1px solid var(--border)',
          }}
          className="skills-grid"
        >
          {skills.map((category, ci) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
            >
              {/* Category label */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: 28,
                }}
              >
                {category.label}
              </p>

              {/* Skill items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {category.items.map((item, si) => (
                  <SkillRow
                    key={item.name}
                    name={item.name}
                    level={item.level}
                    showBorder={si < category.items.length - 1}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            gap: 28,
            marginTop: 28,
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {[
            { level: 'core', label: 'Core', color: levelColors.core },
            { level: 'proficient', label: 'Proficient', color: levelColors.proficient },
            { level: 'familiar', label: 'Familiar', color: levelColors.familiar },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SkillDot color={color} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .skills-grid > div {
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 40px 40px;
        }
        @media (min-width: 641px) {
          .skills-grid > div:nth-child(2n) {
            border-right: none;
          }
          .skills-grid > div:nth-child(n+3) {
            border-bottom: none;
          }
        }
        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
          .skills-grid > div {
            border-right: none !important;
            padding: 32px 24px !important;
          }
          .skills-grid > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  )
}
