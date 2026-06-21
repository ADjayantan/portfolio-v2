import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { repoStats } from '../../data/repoStats'
import PixelReveal from '../layout/PixelReveal'
import { ProjectCard } from './ProjectCard'

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? null : id))
  }, [])

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
          02 — Projects
        </motion.p>
        <PixelReveal text="What I've Built" className="lx-heading" />

        {/* Project list */}
        <div>
          {projects.map((project, i) => {
            const isOpen = open === project.id
            const stats = repoStats[project.id] || { stars: 0, forks: 0 }
            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isOpen={isOpen}
                stats={stats}
                onToggle={handleToggle}
              />
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
