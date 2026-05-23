import { useScroll, useSpring, motion } from 'framer-motion'

export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%)',
        transformOrigin: 'left',
        scaleX,
        zIndex: 9998,
        boxShadow: '0 0 8px rgba(201,169,110,0.5)',
      }}
    />
  )
}
