"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const steps = [
    "Initializing portfolio...",
    "Loading components...",
    "Setting up tools...",
    "Preparing animations...",
    "Almost ready...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5

        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex])
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* Tech Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-md mx-auto px-4 relative z-10">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-spin">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
          </div>
          <h1 className="font-heading font-black text-3xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developer Portfolio
          </h1>
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground min-h-[20px]">{currentStep}</p>
          <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
