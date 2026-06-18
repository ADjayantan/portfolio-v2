import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import SoundToggle from './SoundToggle'
import Magnetic from './Magnetic'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'DSA',      href: '#dsa' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Location', href: '#location' },
  { label: 'Contact',  href: '#contact' },
]

const SECTION_IDS = ['about', 'projects', 'dsa', 'skills', 'location', 'contact']

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeSection, setActive] = useState('')

  // Scroll-based bg
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`) },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    const lenis = (window as Window & { lenis?: { scrollTo: (target: string | number) => void } }).lenis
    if (lenis) {
      lenis.scrollTo(href)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000, height: 64,
          display: 'flex', alignItems: 'center',
          padding: '0 40px', gap: 16,
          transition: 'background 0.4s, border-color 0.4s',
          background: scrolled ? 'rgba(7,8,12,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => {
            const lenis = (window as Window & { lenis?: { scrollTo: (target: string | number) => void } }).lenis
            if (lenis) lenis.scrollTo(0)
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          style={{
            background: 'none', border: 'none',
            fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
            fontWeight: 500, color: 'var(--gold)',
            letterSpacing: '0.08em', cursor: 'pointer', lineHeight: 1,
          }}
        >
          JAI
        </button>

        {/* Desktop nav */}
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 28, alignItems: 'center' }} className="nav-desktop">
          {NAV_LINKS.map((l) => {
            const isActive = activeSection === l.href
            return (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '9px',
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: isActive ? 'var(--gold)' : 'var(--muted)',
                  transition: 'color 0.2s', cursor: 'pointer',
                  position: 'relative', padding: '4px 0',
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
              >
                {l.label}
                {/* Active underline */}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0,
                    height: 1, background: 'var(--gold)',
                  }} />
                )}
              </button>
            )
          })}

          {/* Sound toggle */}
          <Magnetic>
            <SoundToggle />
          </Magnetic>

          {/* Theme toggle */}
          <Magnetic>
            <button
              onClick={toggle}
              style={{
                background: 'none', border: '1px solid var(--border-light)',
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
            </button>
          </Magnetic>
        </nav>

        {/* Mobile controls & hamburger */}
        <div style={{ marginLeft: 'auto', display: 'none', gap: 10, alignItems: 'center' }} className="nav-mobile-controls">
          <Magnetic>
            <SoundToggle />
          </Magnetic>
          
          <Magnetic>
            <button
              onClick={toggle}
              style={{
                background: 'none', border: '1px solid var(--border-light)',
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={13} strokeWidth={1.5} /> : <Moon size={13} strokeWidth={1.5} />}
            </button>
          </Magnetic>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 6px',
              cursor: 'pointer', justifyContent: 'center', alignItems: 'center',
              width: 34, height: 34, position: 'relative', zIndex: 1001,
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => {
              let transform = 'none'
              let opacity = 1
              if (menuOpen) {
                if (i === 0) transform = 'translateY(6px) rotate(45deg)'
                if (i === 1) opacity = 0
                if (i === 2) transform = 'translateY(-6px) rotate(-45deg)'
              }
              return (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: 22,
                    height: 1,
                    background: menuOpen ? 'var(--gold)' : 'var(--text)',
                    transform,
                    opacity,
                    transition: 'transform 0.3s ease, opacity 0.3s ease, background 0.3s ease',
                    transformOrigin: 'center',
                  }}
                />
              )
            })}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(7,8,12,0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 40,
        }}>
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-serif)', fontSize: '2.4rem',
                fontWeight: 300, color: activeSection === l.href ? 'var(--gold)' : 'var(--cream)',
                letterSpacing: '0.08em', cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-controls { display: flex !important; }
        }
      `}</style>
    </>
  )
}
