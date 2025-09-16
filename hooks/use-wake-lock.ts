"use client"

import { useState, useEffect, useCallback } from "react"

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)

  useEffect(() => {
    setIsSupported("wakeLock" in navigator)
  }, [])

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return false

    try {
      const lock = await navigator.wakeLock.request("screen")
      setWakeLock(lock)
      setIsActive(true)

      lock.addEventListener("release", () => {
        setIsActive(false)
        setWakeLock(null)
      })

      return true
    } catch (error) {
      console.error("Failed to request wake lock:", error)
      return false
    }
  }, [isSupported])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release()
        setWakeLock(null)
        setIsActive(false)
      } catch (error) {
        console.error("Failed to release wake lock:", error)
      }
    }
  }, [wakeLock])

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  }
}
