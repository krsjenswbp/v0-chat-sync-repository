"use client"

import { useState, useEffect } from "react"

export function useTabVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = typeof document !== "undefined" && "visibilityState" in document
    setIsSupported(supported)

    if (!supported) return

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible")
    }

    setIsVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return { isVisible, isSupported }
}
