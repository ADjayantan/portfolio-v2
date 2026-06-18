import { motion } from 'framer-motion'
import { Github, Linkedin, Code2, Mail, Download } from 'lucide-react'
import { profile } from '../../data/profile'
import { leetcodeStats } from '../../data/stats'

const LINKS = [
  {
    icon: Github, label: 'GitHub', handle: '@ADjayantan',
    url: profile.links.github, desc: 'Source code & projects',
  },
  {
    icon: Linkedin, label: 'LinkedIn', handle: 'ad-jayantan',
    url: profile.links.linkedin, desc: 'Professional profile',
  },
  {
    icon: Code2, label: 'LeetCode', handle: 'jayantan',
    url: profile.links.leetcode, desc: `${leetcodeStats.total} solved`,
  },
  {
    icon: Mail, label: 'Email', handle: 'adjayantan2007@gmail.com',
    url: 'mailto:adjayantan2007@gmail.com', desc: 'Direct message',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          06 — Contact
        </motion.p>

        {/* Large closing statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 300,
            color: 'var(--cream)',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            maxWidth: 700,
            marginBottom: 16,
          }}
        >
          Let's build something
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}> real.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--muted)',
            marginBottom: 64,
          }}
        >
          Open to frontend roles, internships, and interesting side projects.
        </motion.p>

        {/* Link cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 0,
            border: '1px solid var(--border)',
            marginBottom: 40,
          }}
          className="contact-grid"
        >
          {LINKS.map(({ icon: Icon, label, handle, url, desc }, i) => (
            <motion.a
              key={label}
              href={url}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                textDecoration: 'none',
                transition: 'background 0.25s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.03)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                border: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)',
                transition: 'border-color 0.2s',
              }}>
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 400,
                  color: 'var(--cream)',
                  marginBottom: 4,
                  letterSpacing: '0.01em',
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'var(--gold)',
                  marginBottom: 4,
                }}>
                  {handle}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--muted)',
                }}>
                  {desc}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <a
            href={profile.links.resume}
            download="Jayantan_AD_Resume.pdf"
            className="btn-gold"
            style={{ gap: 10, fontSize: '10px', padding: '14px 40px' }}
          >
            <Download size={13} strokeWidth={1.5} />
            Download Resume
          </a>
        </motion.div>
      </div>

      <style>{`
        .contact-grid > a {
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 32px 32px;
        }
        @media (min-width: 601px) {
          .contact-grid > a:nth-child(2n) {
            border-right: none;
          }
          .contact-grid > a:nth-child(n+3) {
            border-bottom: none;
          }
        }
        @media (max-width: 600px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-grid > a {
            border-right: none !important;
            padding: 24px 20px !important;
          }
          .contact-grid > a:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  )
}
