"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)

  const welcomeTexts = [
    "Welcome to my digital workspace",
    "Where creativity meets functionality",
    "Explore interactive tools and projects",
    "Let's build something amazing together",
  ]

  const fullText = welcomeTexts[currentIndex] || ""

  useEffect(() => {
    if (currentIndex >= welcomeTexts.length) {
      setShowButton(true)
      return
    }

    const typeText = () => {
      if (currentText.length < fullText.length) {
        setCurrentText(fullText.slice(0, currentText.length + 1))
      } else {
        setTimeout(() => {
          if (currentIndex < welcomeTexts.length - 1) {
            setCurrentText("")
            setCurrentIndex(currentIndex + 1)
          } else {
            setShowButton(true)
          }
        }, 1500)
      }
    }

    const timeout = setTimeout(typeText, 100)
    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, fullText])

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
        <div className="mb-12">
          <h1 className="font-heading font-black text-6xl md:text-8xl mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hello
          </h1>

          <div className="h-16 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-muted-foreground">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </div>

        {/* Skills Animation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL"].map((skill, index) => (
              <div
                key={skill}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {showButton && (
          <div className="animate-fadeIn" style={{ animation: "fadeIn 1s ease-out" }}>
            <Button
              size="lg"
              onClick={onComplete}
              className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              aria-label="Enter portfolio"
            >
              Enter Portfolio
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
