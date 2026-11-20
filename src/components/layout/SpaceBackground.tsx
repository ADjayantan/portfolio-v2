import { useTheme } from '../../hooks/useTheme'
import GradientASCII from './GradientASCII'

const ATMOSPHERE_COLORS = ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']

export default function SpaceBackground() {
  const { theme } = useTheme()

  return (
    <GradientASCII
      colors={ATMOSPHERE_COLORS}
      shape="horizon"
      characters=" .·•●"
      cellSize={18}
      density={0.8}
      glyphOpacity={0.85}
      glow={0.2}
      depthOfField={0}
      flicker={0.2}
      softness={0.5}
      scale={1}
      flow={0.5}
      speed={1}
      gradientOpacity={0.9}
      grain={0.08}
      variation={0}
      mouseInteraction
      scrambleRadius={0.1}
      clickEffect="wave"
      intro
      lightMode={theme === 'light'}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
