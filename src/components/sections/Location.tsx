import { motion } from 'framer-motion'
import { MapPin, Building2, Wifi, Navigation } from 'lucide-react'

const FACTS = [
  { icon: MapPin,    label: 'City',         value: 'Coimbatore, Tamil Nadu, India' },
  { icon: Building2, label: 'College',      value: 'VSB College of Engineering & Technical Campus' },
  { icon: Wifi,      label: 'Availability', value: 'Remote · Hybrid · Relocation (PAN India)' },
  { icon: Navigation,label: 'Nearest Hub',  value: 'Chennai — 6 hrs · Bangalore — 5 hrs' },
]

export default function Location() {
  return (
    <section id="location" className="lx-section">
      <div className="lx-container">
        <motion.p
          className="lx-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          05 — Where I Am
        </motion.p>
        <motion.h2
          className="lx-heading"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          Coimbatore
        </motion.h2>

        {/* Map + info split */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, border: '1px solid var(--border)' }}
          className="location-grid"
        >
          {/* Map */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}
          >
            <iframe
              title="Coimbatore Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=76.8%2C10.85%2C77.1%2C11.1&layer=mapnik&marker=11.0168%2C76.9558"
              style={{
                width: '100%',
                height: '100%',
                minHeight: 380,
                border: 'none',
                display: 'block',
                filter: 'grayscale(85%) contrast(1.15) brightness(0.55) sepia(15%)',
              }}
              loading="lazy"
            />
            {/* Gold overlay tint */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(201,169,110,0.04)',
              pointerEvents: 'none',
            }} />
            {/* Location pin label */}
            <div style={{
              position: 'absolute', bottom: 20, left: 20,
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              background: 'rgba(7,8,12,0.85)',
              padding: '6px 12px',
              border: '1px solid var(--border)',
            }}>
              11.0168° N · 76.9558° E
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '48px 36px',
              background: 'var(--surface)',
            }}
          >
            {/* Header */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 28,
            }}>
              Current Base
            </p>

            {FACTS.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '18px 0',
                  borderBottom: i < FACTS.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={1.5}
                  style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }}
                />
                <div>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 4,
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    color: 'var(--cream)',
                    lineHeight: 1.4,
                  }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Distance strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderLeft: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
          className="dist-strip"
        >
          {[
            { city: 'Chennai', time: '6 hrs', mode: 'Train / Bus' },
            { city: 'Bangalore', time: '5 hrs', mode: 'Bus / Road' },
            { city: 'Mumbai', time: '2 hrs', mode: 'Flight' },
          ].map((d, i) => (
            <div
              key={d.city}
              style={{
                padding: '20px 28px',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)' }}>
                {d.time}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--gold)' }}>
                to {d.city}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)' }}>
                {d.mode}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .location-grid { grid-template-columns: 1fr !important; }
          .dist-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
