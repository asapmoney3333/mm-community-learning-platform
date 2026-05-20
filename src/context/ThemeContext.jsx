import { createContext, useContext, useEffect, useState } from "react"

import { useAuth } from "./AuthContext"

const ThemeContext = createContext()

const themes = {
  midnight: {
    label: "Midnight",
  },
  ocean: {
    label: "Ocean",
  },
  forest: {
    label: "Forest",
  },
}

const defaultTheme = "midnight"

export function ThemeProvider({ children }) {
  const { profile } = useAuth()
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }

    return window.localStorage.getItem("crypto-theme") || defaultTheme
  })

  useEffect(() => {
    if (!profile?.theme || !themes[profile.theme]) {
      return
    }

    setThemeState(profile.theme)
  }, [profile?.theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("crypto-theme", theme)
  }, [theme])

  function setTheme(nextTheme) {
    if (!themes[nextTheme]) {
      return
    }

    setThemeState(nextTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themes,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
