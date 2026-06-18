import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

export default function SoundToggle() {
  const { audioOn, toggleAudio } = useAudio()

  return (
    <motion.button
      onClick={toggleAudio}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      title={audioOn ? 'Mute ambient sound' : 'Play ambient sound'}
      style={{
        background: 'none',
        border: '1px solid var(--border-light)',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: audioOn ? 'var(--gold)' : 'var(--muted)',
        transition: 'color 0.2s, border-color 0.2s',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Sound wave icon */}
      {audioOn ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}

      {/* Animated rings when on */}
      {audioOn && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            opacity: 0,
          }}
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
}
