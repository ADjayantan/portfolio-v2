import { useRef, useState, ReactElement } from 'react'
import { motion } from 'framer-motion'

interface MagneticProps {
  children: ReactElement
  range?: number // mouse distance range in pixels, default 65
  strength?: number // pull strength factor (0 to 1), default 0.35
}

export default function Magnetic({ children, range = 65, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return

    const { clientX, clientY } = e
    const { left, top, width, height } = el.getBoundingClientRect()

    // Calculate center coordinates of the element
    const centerX = left + width / 2
    const centerY = top + height / 2

    // Distance between mouse and center
    const dx = clientX - centerX
    const dy = clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < range) {
      // Pull strength increases when closer
      const pull = (1 - distance / range) * strength
      setPosition({ x: dx * pull, y: dy * pull })
    } else {
      // Return to static center
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        style={{ display: 'block' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
