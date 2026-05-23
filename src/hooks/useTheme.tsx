import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.style.setProperty('--bg',           '#f5f0e8')
      root.style.setProperty('--surface',      '#ede8de')
      root.style.setProperty('--surface-2',    '#e5dfd3')
      root.style.setProperty('--border',       '#d8d0c0')
      root.style.setProperty('--border-light', '#ccc4b4')
      root.style.setProperty('--gold',         '#9a6f2e')
      root.style.setProperty('--gold-light',   '#b07f38')
      root.style.setProperty('--gold-dim',     'rgba(154,111,46,0.1)')
      root.style.setProperty('--gold-border',  'rgba(154,111,46,0.25)')
      root.style.setProperty('--cream',        '#1a1610')
      root.style.setProperty('--text',         '#4a4438')
      root.style.setProperty('--muted',        '#8a7e6e')
      root.style.setProperty('--muted-2',      '#b8aea0')
      document.body.style.background = '#f5f0e8'
    } else {
      root.style.setProperty('--bg',           '#07080c')
      root.style.setProperty('--surface',      '#0c0e14')
      root.style.setProperty('--surface-2',    '#111420')
      root.style.setProperty('--border',       '#1c1f2c')
      root.style.setProperty('--border-light', '#242838')
      root.style.setProperty('--gold',         '#c9a96e')
      root.style.setProperty('--gold-light',   '#d9ba82')
      root.style.setProperty('--gold-dim',     'rgba(201,169,110,0.1)')
      root.style.setProperty('--gold-border',  'rgba(201,169,110,0.2)')
      root.style.setProperty('--cream',        '#e8dfc8')
      root.style.setProperty('--text',         '#a89e8e')
      root.style.setProperty('--muted',        '#5a5468')
      root.style.setProperty('--muted-2',      '#333040')
      document.body.style.background = '#07080c'
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
