import { motion } from 'framer-motion'
import { skills } from '../../data/skills'
import PixelReveal from '../layout/PixelReveal'

const LEVEL_FILL = { core: 3, proficient: 2, familiar: 1 } as const
const LEVEL_LABEL = { core: 'Core', proficient: 'Proficient', familiar: 'Familiar' } as const

// Three gold bars instead of the old cyan/purple/grey dots: on-palette, and the
// level reads at a glance without a colour legend.
function SkillMeter({ level }: { level: keyof typeof LEVEL_FILL }) {
  const filled = LEVEL_FILL[level]
  return (
    <span
      role="img"
      aria-label={LEVEL_LABEL[level]}
      title={LEVEL_LABEL[level]}
      style={{ display: 'inline-flex', gap: 3, flexShrink: 0 }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 14,
            height: 3,
            background: i < filled ? 'var(--gold)' : 'var(--border-light)',
          }}
        />
      ))}
    </span>
  )
}

interface SkillRowProps {
  name: string
  level: 'core' | 'proficient' | 'familiar'
  showBorder: boolean
}

function SkillRow({ name, level, showBorder }: SkillRowProps) {
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
      <SkillMeter level={level} />
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
          05 — Stack
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
                  fontSize: 'var(--fs-2xs)',
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
          {(['core', 'proficient', 'familiar'] as const).map((level) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SkillMeter level={level} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-2xs)',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                {LEVEL_LABEL[level]}
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
          /* last row (works for any category count) */
          .skills-grid > div:nth-child(odd):nth-last-child(-n+2),
          .skills-grid > div:nth-child(odd):nth-last-child(-n+2) ~ div {
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
