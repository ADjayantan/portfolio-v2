import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, Wifi, Navigation } from 'lucide-react'
import PixelReveal from '../layout/PixelReveal'

const FACTS = [
  { icon: MapPin,    label: 'City',         value: 'Coimbatore, Tamil Nadu, India' },
  { icon: Building2, label: 'College',      value: 'VSB College of Engineering & Technical Campus' },
  { icon: Wifi,      label: 'Availability', value: 'Remote · Hybrid · Relocation (PAN India)' },
  { icon: Navigation,label: 'Nearest Hub',  value: 'Chennai — 6 hrs · Bangalore — 5 hrs' },
]

function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

type HudStatus = 'idle' | 'pinging' | 'resolving_ip' | 'success' | 'failed'

export default function Location() {
  const [localTime, setLocalTime] = useState('')
  const [hudStatus, setHudStatus] = useState<HudStatus>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [ping, setPing] = useState<number | null>(null)

  // Live IST Clock
  useEffect(() => {
    const update = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const handlePing = () => {
    setHudStatus('pinging')
    setLogs(['> INITIATING PING RESPONSE...'])

    setTimeout(() => {
      setLogs(prev => [...prev, '> ACQUIRING GPS HANDSHAKE...'])

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const dist = calculateHaversine(latitude, longitude, 11.0168, 76.9558)
            const simulatedPing = Math.round(15 + dist * 0.05 + Math.random() * 15)

            setLogs(prev => [
              ...prev,
              `> COORDS ACQUIRED: ${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`,
              `> COMPUTING HAVERSINE INTERCEPT...`,
              `> HANDSHAKE ESTABLISHED.`
            ])

            setTimeout(() => {
              setDistance(dist)
              setPing(simulatedPing)
              setHudStatus('success')
            }, 800)
          },
          (error) => {
            let errorMsg = 'ACCESS DENIED'
            if (error.code === error.TIMEOUT) errorMsg = 'GPS TIMEOUT'
            if (error.code === error.POSITION_UNAVAILABLE) errorMsg = 'GPS POSITION UNAVAILABLE'

            setLogs(prev => [
              ...prev,
              `> GPS FAILED: ${errorMsg}`,
              `> RESOLVING VIA IP GEOLOCATION GATEWAY...`
            ])
            setHudStatus('resolving_ip')

            // Fallback to IP lookup
            fetch('https://ipapi.co/json/')
              .then(res => res.json())
              .then(data => {
                if (data.latitude && data.longitude) {
                  const dist = calculateHaversine(data.latitude, data.longitude, 11.0168, 76.9558)
                  const simulatedPing = Math.round(30 + dist * 0.06 + Math.random() * 20)

                  setLogs(prev => [
                    ...prev,
                    `> GATEWAY: ${data.city || 'UNKNOWN'}, ${data.country_code || 'IP'}`,
                    `> ROUTE ACQUIRED VIA VPN/IP.`
                  ])

                  setTimeout(() => {
                    setDistance(dist)
                    setPing(simulatedPing)
                    setHudStatus('success')
                  }, 800)
                } else {
                  throw new Error('Invalid data')
                }
              })
              .catch(() => {
                // Timezone offset approximation fallback
                setLogs(prev => [
                  ...prev,
                  `> IP GEOLOCATION FAILED`,
                  `> USING REGION TIMEZONE DRIFT...`
                ])

                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
                let fallbackDist = 1800
                let fallbackPing = 120

                if (tz.includes('America')) {
                  fallbackDist = 13500
                  fallbackPing = 240
                } else if (tz.includes('Europe')) {
                  fallbackDist = 7200
                  fallbackPing = 160
                } else if (tz.includes('Australia')) {
                  fallbackDist = 9500
                  fallbackPing = 180
                } else if (tz.includes('Kolkata') || tz.includes('Asia/Kolkata')) {
                  fallbackDist = 450
                  fallbackPing = 35
                }

                setTimeout(() => {
                  setLogs(prev => [
                    ...prev,
                    `> REGION MATCH: ${tz}`,
                    `> ROUTE SECURED WITH STATIC PING.`
                  ])
                  setDistance(fallbackDist)
                  setPing(fallbackPing)
                  setHudStatus('success')
                }, 800)
              })
          },
          { timeout: 5000 }
        )
      } else {
        setLogs(prev => [...prev, '> GPS HANDSHAKE BLOCKED // ROUTING VOID.'])
        setHudStatus('failed')
      }
    }, 600)
  }

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
        <PixelReveal text="Coimbatore" className="lx-heading" />

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
            className="location-info-panel"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'var(--surface)',
            }}
          >
            {/* Header with Clock */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                margin: 0,
              }}>
                Current Base
              </p>
              {localTime && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--gold)',
                  letterSpacing: '0.08em',
                }}>
                  {localTime} IST
                </span>
              )}
            </div>

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
            gridTemplateColumns: 'repeat(4, 1fr)',
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
          ].map((d) => (
            <div
              key={d.city}
              style={{
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

          {/* Interactive HUD Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 88,
              background: 'rgba(201, 169, 110, 0.012)',
            }}
          >
            {hudStatus === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  // Local Node Link
                </span>
                <button
                  onClick={handlePing}
                  className="btn-gold"
                  style={{
                    padding: '8px 12px',
                    fontSize: '8px',
                    width: '100%',
                    justifyContent: 'center',
                    letterSpacing: '0.15em',
                  }}
                >
                  [ PING COIMBATORE ]
                </button>
              </div>
            )}

            {(hudStatus === 'pinging' || hudStatus === 'resolving_ip') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
                <div style={{ maxHeight: 60, overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {logs.slice(-3).map((log, li) => (
                    <span key={li} style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', color: 'var(--gold)', opacity: 0.9 }}>
                      {log}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hudStatus === 'success' && distance !== null && ping !== null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--cream)' }}>
                    {distance.toLocaleString()} km
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--gold)' }}>
                    {ping}ms
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.22em', color: 'var(--gold)', textTransform: 'uppercase', lineHeight: 1 }}>
                  Node Linked
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--muted)', lineHeight: 1 }}>
                  Latency: stable // Gateway: active
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .location-info-panel {
          border-left: 1px solid var(--border);
          padding: 48px 36px;
        }
        .dist-strip > div {
          border-right: 1px solid var(--border);
          padding: 20px 28px;
        }
        .dist-strip > div:last-child {
          border-right: none;
        }
        @media (max-width: 720px) {
          .location-grid {
            grid-template-columns: 1fr !important;
          }
          .location-info-panel {
            border-left: none !important;
            border-top: 1px solid var(--border) !important;
            padding: 36px 24px !important;
          }
          .dist-strip {
            grid-template-columns: 1fr !important;
          }
          .dist-strip > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            padding: 18px 20px !important;
          }
          .dist-strip > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  )
}
