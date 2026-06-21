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

const ProjectCardComponent = ({
  project,
  index,
  isOpen,
  stats,
  onToggle,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      {/* Row header */}
      <button
        onClick={() => onToggle(project.id)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '56px 1fr auto',
          gap: 32,
          alignItems: 'center',
          padding: '32px 0',
          background: 'none',
          border: 'none',
          borderTop: index === 0 ? '1px solid var(--border)' : 'none',
          borderBottom: '1px solid var(--border)',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.02)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        {/* Number */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.8rem',
            fontWeight: 300,
            color: 'var(--border-light)',
            lineHeight: 1,
            letterSpacing: '0.02em',
            transition: 'color 0.3s',
          }}
          className={`proj-num-${project.id}`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + tagline */}
        <div>
          <p
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
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
            }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Arrow + tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}
            className="proj-tags-desktop"
          >
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  padding: '3px 10px',
                  border: '1px solid var(--border)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '28px 0 36px 88px',
                display: 'grid',
                gridTemplateColumns: '1fr 240px',
                gap: 48,
                alignItems: 'start',
                borderBottom: '1px solid var(--border)',
              }}
              className="proj-detail-grid"
            >
              {/* Description */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {project.solution}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        padding: '4px 12px',
                        border: '1px solid var(--gold-border)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                    style={{
                      justifyContent: 'center',
                      fontSize: '9px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Github size={12} /> GitHub
                    {stats.stars > 0 && (
                      <span
                        style={{
                          marginLeft: 6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 2,
                          color: 'var(--gold)',
                        }}
                      >
                        ★ {stats.stars}
                      </span>
                    )}
                    {stats.forks > 0 && (
                      <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        ⌥ {stats.forks}
                      </span>
                    )}
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold"
                    style={{ justifyContent: 'center', fontSize: '9px' }}
                  >
                    <ExternalLink size={12} /> Live Demo
                  </a>
                )}
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
