import { useEffect } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  useEffect(() => {
    onComplete()
  }, [onComplete])

  return null
}
