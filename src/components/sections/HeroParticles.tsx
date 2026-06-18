import { useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  r: number
  g: number
  b: number
  alpha: number
  baseAlpha: number
  angle: number
  speed: number
  glow: boolean
}

export default function HeroParticles() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const shockwaveRef = useRef({ x: -1000, y: -1000, radius: 9999, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1
    const particles: Particle[] = []
    const PARTICLE_COUNT = 150

    const isDark = theme === 'dark'
    // Color definitions in RGB
    const colors = isDark
      ? [
          { r: 201, g: 169, b: 110 }, // Gold
          { r: 232, g: 223, b: 200 }, // Cream
          { r: 110, g: 100, b: 200 }, // Indigo
        ]
      : [
          { r: 154, g: 111, b: 46 },  // Light Gold
          { r: 74,  g: 68,  b: 56 },  // Light Text (Dark Brown)
          { r: 138, g: 126, b: 110 }, // Light Muted
        ]

    // Initialize particles
    const initParticles = (w: number, h: number) => {
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 1.8 + 0.8
        const colorRand = Math.random()
        let color = colors[0] // 70% Gold
        if (colorRand > 0.7 && colorRand <= 0.9) {
          color = colors[1] // 20% Cream
        } else if (colorRand > 0.9) {
          color = colors[2] // 10% Indigo
        }

        const baseAlpha = Math.random() * 0.4 + 0.15

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size,
          r: color.r,
          g: color.g,
          b: color.b,
          alpha: baseAlpha,
          baseAlpha,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2,
          glow: Math.random() > 0.85, // only some glow to save performance
        })
      }
    }

    // Handle Resize
    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)

      initParticles(width, height)
    }

    // Set up sizing
    handleResize()
    window.addEventListener('resize', handleResize)

    // Track Mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      shockwaveRef.current.x = e.clientX - rect.left
      shockwaveRef.current.y = e.clientY - rect.top
      shockwaveRef.current.radius = 0
      shockwaveRef.current.active = true
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true })
      parent.addEventListener('mouseleave', handleMouseLeave, { passive: true })
      parent.addEventListener('mousedown', handleMouseDown, { passive: true })
    }

    // Physics constants
    const MAX_MOUSE_DIST = 190
    const REPULSION_DIST = 38
    const GRAVITY_WELL = 0.09
    const ORBIT_FORCE = 0.05
    const FRICTION = 0.95

    const SHOCKWAVE_MAX_RADIUS = 300
    const SHOCKWAVE_SPEED = 7.5

    // Animation Loop
    function loop() {
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      const shockwave = shockwaveRef.current

      // Update shockwave radius
      if (shockwave.active) {
        shockwave.radius += SHOCKWAVE_SPEED
        if (shockwave.radius > SHOCKWAVE_MAX_RADIUS) {
          shockwave.active = false
        }
      }

      // Coordinates of drifting background gradient orbs (gravity anchors)
      const orbAX = width * 0.12
      const orbAY = height * 0.2
      const orbBX = width * 0.88
      const orbBY = height * 0.75

      // Name block excitation box coordinates
      const nameW = 620
      const nameH = 150
      const nameX = (width - nameW) / 2
      const nameY = (height - nameH) / 2 - 20

      particles.forEach((p) => {
        // 1. Base Flow Field (Gentle drift)
        p.angle += 0.006 * p.speed
        p.vx += Math.cos(p.angle) * 0.003
        p.vy += Math.sin(p.angle) * 0.003

        // 2. Weak Orb gravity pulls
        const dax = orbAX - p.x
        const day = orbAY - p.y
        const distA = Math.sqrt(dax * dax + day * day)
        if (distA > 20) {
          p.vx += (dax / distA) * 0.0018
          p.vy += (day / distA) * 0.0018
        }

        const dbx = orbBX - p.x
        const dby = orbBY - p.y
        const distB = Math.sqrt(dbx * dbx + dby * dby)
        if (distB > 20) {
          p.vx += (dbx / distB) * 0.0018
          p.vy += (dby / distB) * 0.0018
        }

        // 3. Mouse attraction and orbital swirl
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_MOUSE_DIST) {
            const force = 1 - dist / MAX_MOUSE_DIST

            if (dist > REPULSION_DIST) {
              // Pull toward cursor
              p.vx += (dx / dist) * force * GRAVITY_WELL
              p.vy += (dy / dist) * force * GRAVITY_WELL

              // Perpendicular vector for swirl orbit
              p.vx += (-dy / dist) * force * ORBIT_FORCE
              p.vy += (dx / dist) * force * ORBIT_FORCE
            } else {
              // Rapid pushback if too close to mouse
              const pushForce = (REPULSION_DIST - dist) / REPULSION_DIST
              p.vx -= (dx / dist) * pushForce * 0.7
              p.vy -= (dy / dist) * pushForce * 0.7
            }
          }
        }

        // 4. Click Shockwave blast
        if (shockwave.active) {
          const dx = p.x - shockwave.x
          const dy = p.y - shockwave.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (Math.abs(dist - shockwave.radius) < 22) {
            const shockForce = (1 - shockwave.radius / SHOCKWAVE_MAX_RADIUS) * 3.5
            p.vx += (dx / dist) * shockForce
            p.vy += (dy / dist) * shockForce
          }
        }

        // Apply friction and update position
        p.vx *= FRICTION
        p.vy *= FRICTION
        p.x += p.vx
        p.y += p.vy

        // Wrap around boundaries
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // 5. Name block collision and glowing excitation aura
        let insideName = false
        if (p.x > nameX && p.x < nameX + nameW && p.y > nameY && p.y < nameY + nameH) {
          insideName = true
        }

        if (insideName) {
          // Excite particle: float upward and brighten
          p.alpha = Math.min(0.85, p.alpha + 0.03)
          p.vy -= 0.015 // floating heat/excitation
          // Gently push particles out of the exact center of the name block to frame the text
          const cy = nameY + nameH / 2
          p.vy += (p.y > cy ? 0.008 : -0.008)
        } else {
          // Slowly decay back to base alpha
          if (p.alpha > p.baseAlpha) {
            p.alpha -= 0.008
          } else if (p.alpha < p.baseAlpha) {
            p.alpha += 0.008
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.save()

        if ((p.glow || insideName) && isDark) {
          ctx.shadowColor = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha * 0.8})`
          ctx.shadowBlur = insideName ? 10 : 6
        } else {
          ctx.shadowBlur = 0
        }

        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`
        ctx.fill()
        ctx.restore()
      })

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
        parent.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
