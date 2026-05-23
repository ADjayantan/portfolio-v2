import { useState } from 'react'
import { ThemeProvider } from './hooks/useTheme'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/layout/Cursor'
import ProgressBar from './components/layout/ProgressBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Preloader from './components/layout/Preloader'
import Marquee from './components/layout/Marquee'
import BarDivider from './components/layout/BarDivider'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import DSA from './components/sections/DSA'
import Skills from './components/sections/Skills'
import Location from './components/sections/Location'
import Contact from './components/sections/Contact'

function PortfolioApp() {
  const [loaded, setLoaded] = useState(false)
  useSmoothScroll()

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Global UI */}
      <Cursor />
      <ProgressBar />
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Main content fades in after preloader */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: loaded ? 'auto' : 'none',
      }}>
        <Navbar />

        <main>
          {/* ── Hero ─────────────────────────── */}
          <Hero />

          {/* ── Marquee strip ────────────────── */}
          <Marquee
            text="Frontend Developer"
            separator="·"
            speed={55}
            direction="left"
            fontSize="clamp(2rem, 5vw, 3.5rem)"
            color="var(--cream)"
            borderTop
            borderBottom
          />

          {/* ── About ────────────────────────── */}
          <About />

          {/* ── Bar dissolve divider ─────────── */}
          <BarDivider barCount={40} height={160} color="var(--gold)" />

          {/* ── Projects ─────────────────────── */}
          <Projects />

          {/* ── Gold marquee ─────────────────── */}
          <Marquee
            text="DSA · Algorithms · Data Structures"
            separator="/"
            speed={45}
            direction="right"
            fontSize="clamp(1.8rem, 4vw, 3.2rem)"
            color="var(--gold)"
            borderTop
            borderBottom
          />

          {/* ── DSA ──────────────────────────── */}
          <DSA />

          {/* ── Bar divider (inverted — more sparse) ── */}
          <BarDivider barCount={30} height={120} color="rgba(201,169,110,0.4)" />

          {/* ── Skills ───────────────────────── */}
          <Skills />

          {/* ── Location marquee ─────────────── */}
          <Marquee
            text="Coimbatore · Tamil Nadu · India"
            separator="·"
            speed={65}
            direction="left"
            fontSize="clamp(1rem, 2.5vw, 1.6rem)"
            color="var(--muted)"
            borderTop
            borderBottom
          />

          {/* ── Location ─────────────────────── */}
          <Location />

          {/* ── Final bar divider ────────────── */}
          <BarDivider barCount={50} height={200} color="var(--gold)" />

          {/* ── Contact ──────────────────────── */}
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  )
}

// Wrap with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  )
}
