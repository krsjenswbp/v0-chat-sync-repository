"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface IntroMotionProps {
  onComplete: () => void
}

export default function IntroMotion({ onComplete }: IntroMotionProps) {
  const [phase, setPhase] = useState(0) // 0: grid formation, 1: card reveal, 2: final transform
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const sequence = async () => {
      // Phase 0: Grid formation (1.5s)
      setTimeout(() => setPhase(1), 1500)

      // Phase 1: Card reveal animation (2s)
      setTimeout(() => setPhase(2), 3500)

      // Phase 2: Final transform and exit (1s)
      setTimeout(() => handleComplete(), 4500)
    }

    sequence()
  }, [])

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => onComplete(), 800)
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden">
      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        {/* Phase 0: Grid Formation */}
        {phase === 0 && (
          <div className="grid grid-cols-3 gap-4 w-96 h-96">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="glass rounded-xl animate-slide-in-grid opacity-0"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              />
            ))}
          </div>
        )}

        {/* Phase 1: Card Reveal */}
        {phase === 1 && (
          <div className="relative">
            <div className="relative w-80 h-96">
              {/* Background cards */}
              <div className="absolute inset-0 glass rounded-2xl transform rotate-6 scale-95 opacity-30 animate-card-stack-1" />
              <div className="absolute inset-0 glass rounded-2xl transform rotate-3 scale-97 opacity-50 animate-card-stack-2" />

              {/* Main card */}
              <div className="relative glass rounded-2xl p-8 animate-card-reveal">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 animate-scale-pulse" />
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-text-reveal">
                    KrsjenSWb
                  </h1>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-line-expand" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Final Transform */}
        {phase === 2 && (
          <div className="text-center animate-final-zoom">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 animate-morph-circle" />
              <h2 className="text-2xl font-semibold opacity-0 animate-fade-in-final">Welcome</h2>
            </div>
          </div>
        )}
      </div>

      {/* Skip Button */}
      <div className="absolute top-8 right-8 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="glass text-muted-foreground hover:text-foreground"
          aria-label="Skip onboarding animation"
        >
          Skip <span className="ml-1">→</span>
        </Button>
      </div>
    </div>
  )
}
