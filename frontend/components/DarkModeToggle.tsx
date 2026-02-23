'use client'

import { useTheme } from "./ThemeProvider"

export default function DarkModeToggle() {
  const {toggle, isDark} = useTheme()

  return (
    <button onClick={toggle}>
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}