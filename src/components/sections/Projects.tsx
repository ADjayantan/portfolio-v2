import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronDown } from 'lucide-react'
import { projects } from '../../data/projects'

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="projects" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          02 — Projects
        </motion.p>
        <motion.h2
          className="lx-heading"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          What I've Built
        </motion.h2>

        {/* Project list */}
        <div>
          {projects.map((project, i) => {
            const isOpen = open === project.id
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                {/* Row header */}
                <button
                  onClick={() => setOpen(isOpen ? null : project.id)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    gap: 32,
                    alignItems: 'center',
                    padding: '32px 0',
                    background: 'none',
                    border: 'none',
                    borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.02)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {/* Number */}
                  <span style={{
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
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title + tagline */}
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                      fontWeight: 400,
                      color: 'var(--cream)',
                      letterSpacing: '0.02em',
                      marginBottom: 6,
                      lineHeight: 1.1,
                    }}>
                      {project.title}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      color: 'var(--muted)',
                    }}>
                      {project.tagline}
                    </p>
                  </div>

                  {/* Arrow + tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}
                         className="proj-tags-desktop">
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
                          <p style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.15rem',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            color: 'var(--text)',
                            lineHeight: 1.7,
                            marginBottom: 16,
                          }}>
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
                              style={{ justifyContent: 'center', fontSize: '9px' }}
                            >
                              <Github size={12} /> GitHub
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
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .proj-tags-desktop { display: none !important; }
          .proj-detail-grid { 
            grid-template-columns: 1fr !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
