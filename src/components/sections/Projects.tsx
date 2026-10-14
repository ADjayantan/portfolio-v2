import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { repoStats } from '../../data/repoStats'
import PixelReveal from '../layout/PixelReveal'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../../types'

type Filter = 'all' | Project['category']

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ml', label: 'ML & AI' },
  { id: 'backend', label: 'Backend & Apps' },
]

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all')
  // Lead project starts open so the depth of the work is visible without a click
  const [open, setOpen] = useState<string | null>(projects[0]?.id ?? null)

  const handleToggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? null : id))
  }, [])

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          03 — Projects
        </motion.p>
        <PixelReveal text="What I've Built" className="lx-heading" />

        {/* Filters */}
        <div className="proj-filters" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length
            const active = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`proj-filter${active ? ' is-active' : ''}`}
              >
                {f.label}
                <span className="proj-filter-count">{String(count).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>

        {/* Project list */}
        <div>
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isOpen={open === project.id}
              stats={repoStats[project.id] || { stars: 0, forks: 0 }}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>

      <style>{`
        .proj-filters {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
          margin: -28px 0 36px;
        }
        .proj-filter {
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          padding: 6px 0;
          font-family: var(--font-mono);
          font-size: var(--fs-xs);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--muted);
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          transition: color 0.2s, border-color 0.2s;
        }
        .proj-filter:hover { color: var(--cream); }
        .proj-filter.is-active { color: var(--gold); border-bottom-color: var(--gold); }
        .proj-filter-count { font-size: var(--fs-2xs); letter-spacing: 0.1em; }

        .proj-row { transition: background 0.2s; }
        .proj-row:hover { background: var(--gold-dim) !important; }
        .proj-num { color: var(--muted-2); transition: color 0.3s; }
        .proj-row:hover .proj-num,
        .proj-row.is-open .proj-num { color: var(--gold); }

        @media (max-width: 640px) {
          .proj-tags-desktop { display: none !important; }
          .proj-hl-mobile { display: flex !important; }
          .proj-row { grid-template-columns: 40px 1fr auto !important; gap: 16px !important; }
          .proj-num { font-size: 2rem !important; }
          .proj-detail-grid {
            grid-template-columns: 1fr !important;
            padding-left: 0 !important;
            gap: 28px !important;
          }
          .proj-filters { gap: 20px; margin-top: -12px; }
        }
      `}</style>
    </section>
  )
}
