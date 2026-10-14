// The preloader + pixel-name intro plays once per browser session, and never for
// visitors whose OS asks to reduce motion. Reloads and return visits skip straight
// to the settled page so recruiters reach the content (and the resume) instantly.
const INTRO_KEY = 'intro-seen'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function shouldSkipIntro(): boolean {
  try {
    if (sessionStorage.getItem(INTRO_KEY) === '1') return true
  } catch {
    /* storage unavailable — fall through */
  }
  return prefersReducedMotion()
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* ignore */
  }
}
