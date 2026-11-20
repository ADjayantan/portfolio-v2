import { motion } from 'framer-motion'
import { profile } from '../../data/profile'

const DOT_CLUSTER = ['.', '·', '•', '●', '•', '·', '.'] as const

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ padding: '24px 24px 48px' }}>
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '48px 48px 36px',
          background: 'var(--section-surface)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(3, 6, 14, 0.38)',
        }}
      >
        {/* ASCII dot-matrix emblem */}
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--gold-light)',
            textShadow: '0 0 14px rgba(56, 189, 248, 0.6)',
          }}
        >
          {DOT_CLUSTER.map((ch, i) => (
            <span
              key={i}
              style={{
                opacity: i === 3 ? 1 : i === 2 || i === 4 ? 0.72 : 0.45,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Large logo text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
            fontWeight: 300,
            color: 'var(--cream)',
            letterSpacing: '0.1em',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          AD <em style={{ fontStyle: 'italic' }}>Jayantan</em>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          {profile.title} · Coimbatore, India
        </motion.p>

        {/* Bottom row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          borderTop: '1px solid var(--border)', paddingTop: 24,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: '0.2em', color: 'var(--muted)' }}>
            © {year} · AD Jayantan
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: '0.2em', color: 'var(--muted)' }}>
            Built with React + Vite + WebGL2
          </p>
        </div>
      </div>
    </footer>
  )
}
