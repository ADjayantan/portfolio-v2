import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronDown } from 'lucide-react'
import type { Project } from '../../types'

interface ProjectCardProps {
  project: Project
  index: number
  isOpen: boolean
  stats: { stars: number; forks: number }
  onToggle: (id: string) => void
}

const label = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  marginBottom: 10,
}

const ProjectCardComponent = ({
  project,
  index,
  isOpen,
  stats,
  onToggle,
}: ProjectCardProps) => {
  const btnId = `proj-btn-${project.id}`
  const panelId = `proj-panel-${project.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: Math.min(index, 4) * 0.06 }}
    >
      {/* Row header */}
      <button
        id={btnId}
        onClick={() => onToggle(project.id)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`proj-row${isOpen ? ' is-open' : ''}`}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '56px 1fr auto',
          gap: 32,
          alignItems: 'center',
          padding: '30px 0',
          background: 'none',
          border: 'none',
          borderTop: index === 0 ? '1px solid var(--border)' : 'none',
          borderBottom: '1px solid var(--border)',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {/* Number */}
        <span
          className="proj-num"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.8rem',
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + tagline */}
        <div style={{ minWidth: 0 }}>
          <p
            className="proj-title"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--cream)',
              letterSpacing: '0.02em',
              marginBottom: 6,
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-sm)',
              letterSpacing: '0.04em',
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            {project.tagline}
          </p>
          {/* Metrics under the tagline on phones */}
          <div className="proj-hl-mobile" style={{ display: 'none', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {project.highlights.slice(0, 2).map((h) => (
              <span key={h} className="lx-chip">{h}</span>
            ))}
          </div>
        </div>

        {/* Metrics + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 380 }}
            className="proj-tags-desktop"
          >
            {project.highlights.slice(0, 2).map((h) => (
              <span key={h} className="lx-chip">{h}</span>
            ))}
          </div>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            style={{
              color: 'var(--gold)',
              flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s',
            }}
          />
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '30px 0 40px 88px',
                display: 'grid',
                gridTemplateColumns: '1fr 240px',
                gap: 56,
                alignItems: 'start',
                borderBottom: '1px solid var(--border)',
              }}
              className="proj-detail-grid"
            >
              {/* Story */}
              <div>
                <p style={label}>Problem</p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: 'var(--cream)',
                    lineHeight: 1.6,
                    marginBottom: 26,
                  }}
                >
                  {project.problem}
                </p>

                <p style={label}>Approach</p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    lineHeight: 1.7,
                  }}
                >
                  {project.solution}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--fs-2xs)',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        padding: '4px 12px',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Results + links */}
              <div>
                <p style={label}>Key results</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.1rem',
                        color: 'var(--cream)',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span aria-hidden="true" style={{ width: 5, height: 5, background: 'var(--gold)', flexShrink: 0 }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-solid"
                      style={{ justifyContent: 'center' }}
                    >
                      <ExternalLink size={12} aria-hidden="true" /> Live Demo
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold"
                      style={{ justifyContent: 'center' }}
                    >
                      <Github size={12} aria-hidden="true" /> Source
                      {stats.stars > 0 && <span style={{ marginLeft: 6 }}>★ {stats.stars}</span>}
                      {stats.forks > 0 && <span style={{ marginLeft: 6 }}>⌥ {stats.forks}</span>}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ProjectCardComponent.displayName = 'ProjectCard'

export const ProjectCard = memo(ProjectCardComponent)
