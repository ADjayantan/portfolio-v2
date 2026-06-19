/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'

interface AudioCtx {
  audioOn: boolean
  toggleAudio: () => void
  playHover: () => void
  playClick: () => void
  analyser: AnalyserNode | null
}

const AudioContext = createContext<AudioCtx>({
  audioOn: false,
  toggleAudio: () => {},
  playHover: () => {},
  playClick: () => {},
  analyser: null,
})

// Cross-browser AudioContext resolution without using 'any'
const AudioContextClass = typeof window !== 'undefined'
  ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
  : null

// Synthesize short UI tick for hover
const playHoverSound = (audioCtx?: AudioContext | null, dest?: AudioNode | null) => {
  if (!AudioContextClass) return
  try {
    const ctx = audioCtx || new AudioContextClass()
    const targetDest = dest || ctx.destination
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    // Sleek high-frequency mechanical click
    osc.frequency.setValueAtTime(1600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.015)

    gain.gain.setValueAtTime(0.025, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015)

    osc.connect(gain)
    gain.connect(targetDest)
    osc.start()
    osc.stop(ctx.currentTime + 0.02)
  } catch {
    // ignore blocked audio
  }
}

// Synthesize short UI blip for click confirmation
const playClickSound = (audioCtx?: AudioContext | null, dest?: AudioNode | null) => {
  if (!AudioContextClass) return
  try {
    const ctx = audioCtx || new AudioContextClass()
    const targetDest = dest || ctx.destination
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(750, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.045, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(targetDest)
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  } catch {
    // ignore blocked audio
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioOn, setAudioOn] = useState(() => {
    return localStorage.getItem('audioOn') === 'true'
  })

  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const synthCtxRef = useRef<AudioContext | null>(null)
  const synthOscsRef = useRef<OscillatorNode[]>([])

  const startSynth = () => {
    if (!AudioContextClass) return
    try {
      if (synthCtxRef.current) return
      const audioCtx = new AudioContextClass()
      synthCtxRef.current = audioCtx

      // Setup analyser
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 256
      setAnalyser(analyserNode)

      // Chord frequencies for warm analog synth pad: C2, G2, C3, E3, G3
      const freqs = [65.41, 98.00, 130.81, 164.81, 196.00]
      const filter = audioCtx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(230, audioCtx.currentTime) // warm, soft cut-off

      const masterGain = audioCtx.createGain()
      masterGain.gain.setValueAtTime(0.04, audioCtx.currentTime) // very soft ambient background

      freqs.forEach((freq) => {
        const osc = audioCtx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, audioCtx.currentTime)

        const gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime)

        osc.connect(gainNode)
        gainNode.connect(filter)
        osc.start()
        synthOscsRef.current.push(osc)

        const lfoInterval = setInterval(() => {
          if (audioCtx.state === 'closed') {
            clearInterval(lfoInterval)
            return
          }
          // Slow breathing modulation
          osc.detune.linearRampToValueAtTime((Math.random() - 0.5) * 12, audioCtx.currentTime + 4.0)
          gainNode.gain.linearRampToValueAtTime(Math.random() * 0.14 + 0.08, audioCtx.currentTime + 3.0)
        }, 4000)
      })

      filter.connect(masterGain)
      // Route masterGain -> analyserNode -> destination
      masterGain.connect(analyserNode)
      analyserNode.connect(audioCtx.destination)
    } catch {
      // ignore blocked audio
    }
  }

  const stopSynth = () => {
    synthOscsRef.current.forEach(o => {
      try {
        o.stop()
      } catch {
        // ignore stop error
      }
    })
    synthOscsRef.current = []
    if (synthCtxRef.current) {
      try {
        synthCtxRef.current.close()
      } catch {
        // ignore close error
      }
      synthCtxRef.current = null
    }
    // Defer state update to avoid synchronous cascading renders warning inside effects
    setTimeout(() => {
      setAnalyser(null)
    }, 0)
  }

  // Manage ambient synth lifecycle
  useEffect(() => {
    if (audioOn) {
      const initOnInteraction = () => {
        startSynth()
        window.removeEventListener('click', initOnInteraction)
        window.removeEventListener('keydown', initOnInteraction)
      }
      window.addEventListener('click', initOnInteraction, { once: true })
      window.addEventListener('keydown', initOnInteraction, { once: true })
      return () => {
        window.removeEventListener('click', initOnInteraction)
        window.removeEventListener('keydown', initOnInteraction)
      }
    } else {
      stopSynth()
    }
    return stopSynth
  }, [audioOn])

  // Event delegation for global hover and click sounds
  useEffect(() => {
    if (!audioOn) return

    let lastTarget: HTMLElement | null = null

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [role="button"]') as HTMLElement
      if (target && target !== lastTarget) {
        // Connect hover sound to active analyser if available
        playHoverSound(synthCtxRef.current, analyser)
        lastTarget = target
      } else if (!target) {
        lastTarget = null
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [role="button"]')
      if (target) {
        // Connect click sound to active analyser if available
        playClickSound(synthCtxRef.current, analyser)
      }
    }

    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('click', handleClick, { passive: true })
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('click', handleClick)
    }
  }, [audioOn, analyser])

  const toggleAudio = () => {
    setAudioOn((prev) => {
      const next = !prev
      localStorage.setItem('audioOn', String(next))
      return next
    })
  }

  const playHover = () => {
    if (audioOn) playHoverSound(synthCtxRef.current, analyser)
  }

  const playClick = () => {
    if (audioOn) playClickSound(synthCtxRef.current, analyser)
  }

  return (
    <AudioContext.Provider value={{ audioOn, toggleAudio, playHover, playClick, analyser }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)
