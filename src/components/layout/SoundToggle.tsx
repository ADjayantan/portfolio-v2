import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Free ambient forest/rain sound from a public CDN
const AUDIO_URL = 'https://www.soundjay.com/nature/sounds/rain-01.mp3'
// Fallback: use a reliable public domain ambient sound
const AUDIO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Grouse_moor_ambient_sound.ogg'

export default function SoundToggle() {
  const audioRef     = useRef<HTMLAudioElement | null>(null)
  const [on, setOn]  = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.loop   = true
    audio.volume = 0.18
    audio.preload = 'none'

    // Try primary, fallback on error
    audio.src = AUDIO_URL
    audio.onerror = () => { audio.src = AUDIO_FALLBACK }
    audio.oncanplaythrough = () => setReady(true)

    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (on) {
      audio.pause()
      setOn(false)
    } else {
      // Load on first play
      if (!ready) audio.load()
      audio.play().catch(() => {}) // browser may block autoplay
      setOn(true)
    }
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      title={on ? 'Mute ambient sound' : 'Play ambient sound'}
      style={{
        background: 'none',
        border: '1px solid var(--border-light)',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: on ? 'var(--gold)' : 'var(--muted)',
        transition: 'color 0.2s, border-color 0.2s',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Sound wave icon */}
      {on ? (
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
      {on && (
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
