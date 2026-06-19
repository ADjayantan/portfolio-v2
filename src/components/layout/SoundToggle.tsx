import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

export default function SoundToggle() {
  const { audioOn, toggleAudio, analyser } = useAudio()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!audioOn || !analyser) return

    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    cv.width = 34 * dpr
    cv.height = 34 * dpr
    ctx.scale(dpr, dpr)

    let active = true
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!active) return

      ctx.clearRect(0, 0, 34, 34)

      analyser.getByteTimeDomainData(dataArray)

      ctx.beginPath()
      ctx.lineWidth = 1.0
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.7)' // soft gold
      ctx.shadowColor = 'rgba(201, 169, 110, 0.5)'
      ctx.shadowBlur = 2

      const sliceWidth = 34 / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * 34) / 2
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }

      ctx.stroke()
      ctx.shadowBlur = 0

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      active = false
    }
  }, [audioOn, analyser])

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
        overflow: 'hidden',
      }}
    >
      {/* Sound wave canvas */}
      {audioOn && analyser && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.7,
            zIndex: 0,
          }}
        />
      )}

      {/* Sound wave icon */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
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
      </div>
    </motion.button>
  )
}
