"use client"

import { useState, useEffect } from "react"

interface UserPreferences {
  theme: "light" | "dark" | "system"
  screensaverTimeout: number
  mouseSensitivity: number
  enableWakeLock: boolean
  enableKeyboardShortcuts: boolean
  autoSaveInterval: number
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  screensaverTimeout: 60000, // 60 seconds
  mouseSensitivity: 50, // 0-100 scale
  enableWakeLock: false,
  enableKeyboardShortcuts: true,
  autoSaveInterval: 5000, // 5 seconds
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-preferences")
      if (saved) {
        const parsed = JSON.parse(saved)
        setPreferences({ ...defaultPreferences, ...parsed })
      }
    } catch (error) {
      console.error("Failed to load preferences:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Auto-save preferences
  useEffect(() => {
    if (!isLoaded) return

    const savePreferences = () => {
      try {
        localStorage.setItem("portfolio-preferences", JSON.stringify(preferences))
      } catch (error) {
        console.error("Failed to save preferences:", error)
      }
    }

    const timeoutId = setTimeout(savePreferences, preferences.autoSaveInterval)
    return () => clearTimeout(timeoutId)
  }, [preferences, isLoaded])

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem("portfolio-preferences")
  }

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded,
  }
}
