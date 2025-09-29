"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"

interface ScreensaverContextType {
  isScreensaverActive: boolean
  resetTimer: () => void
}

const ScreensaverContext = createContext<ScreensaverContextType | undefined>(undefined)

export function useScreensaver() {
  const context = useContext(ScreensaverContext)
  if (!context) {
    throw new Error("useScreensaver must be used within a ScreensaverProvider")
  }
  return context
}

interface ScreensaverProviderProps {
  children: ReactNode
  timeout?: number // in milliseconds
}

export function ScreensaverProvider({ children, timeout = 60000 }: ScreensaverProviderProps) {
  const [isScreensaverActive, setIsScreensaverActive] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer)
    }

    setIsScreensaverActive(false)

    const newTimer = setTimeout(() => {
      setIsScreensaverActive(true)
    }, timeout)

    setTimer(newTimer)
  }

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      resetTimer()
    }

    // Set initial timer
    resetTimer()

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [timer, timeout])

  return (
    <ScreensaverContext.Provider value={{ isScreensaverActive, resetTimer }}>
      {children}
      {isScreensaverActive && <AdvancedScreensaver />}
    </ScreensaverContext.Provider>
  )
}

function AdvancedScreensaver() {
  const { resetTimer } = useScreensaver()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentQuote, setCurrentQuote] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const developerQuotes = [
    "Code is poetry written in logic.",
    "The best error message is the one that never shows up.",
    "Simplicity is the ultimate sophistication.",
    "First, solve the problem. Then, write the code.",
    "Code never lies, comments sometimes do.",
    "The most important property of a program is whether it accomplishes the intention of its user.",
    "Programming isn't about what you know; it's about what you can figure out.",
    "Clean code always looks like it was written by someone who cares.",
  ]

  useEffect(() => {
    // Set random quote
    setCurrentQuote(developerQuotes[Math.floor(Math.random() * developerQuotes.length)])

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Geometric patterns animation
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let time = 0
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw geometric patterns
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2

          // Rotating hexagons
          for (let i = 0; i < 3; i++) {
            const radius = 100 + i * 50
            const rotation = time * 0.001 + (i * Math.PI) / 3

            ctx.beginPath()
            ctx.strokeStyle = `rgba(8, 145, 178, ${0.1 - i * 0.02})`
            ctx.lineWidth = 2

            for (let j = 0; j < 6; j++) {
              const angle = (j * Math.PI) / 3 + rotation
              const x = centerX + Math.cos(angle) * radius
              const y = centerY + Math.sin(angle) * radius

              if (j === 0) {
                ctx.moveTo(x, y)
              } else {
                ctx.lineTo(x, y)
              }
            }
            ctx.closePath()
            ctx.stroke()
          }

          // Floating geometric shapes
          for (let i = 0; i < 8; i++) {
            const x = centerX + Math.cos(time * 0.0005 + i) * (200 + i * 30)
            const y = centerY + Math.sin(time * 0.0007 + i) * (150 + i * 20)
            const size = 10 + Math.sin(time * 0.002 + i) * 5

            ctx.beginPath()
            ctx.fillStyle = `rgba(245, 158, 11, ${0.15 + Math.sin(time * 0.003 + i) * 0.1})`

            if (i % 3 === 0) {
              // Triangle
              ctx.moveTo(x, y - size)
              ctx.lineTo(x - size, y + size)
              ctx.lineTo(x + size, y + size)
              ctx.closePath()
            } else if (i % 3 === 1) {
              // Circle
              ctx.arc(x, y, size, 0, Math.PI * 2)
            } else {
              // Square
              ctx.rect(x - size, y - size, size * 2, size * 2)
            }
            ctx.fill()
          }

          // Mouse following particles
          const particleCount = 5
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time * 0.002
            const distance = 50 + Math.sin(time * 0.003 + i) * 20
            const x = mousePosition.x + Math.cos(angle) * distance
            const y = mousePosition.y + Math.sin(angle) * distance

            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(8, 145, 178, ${0.6 - i * 0.1})`
            ctx.fill()
          }

          time += 16
          animationRef.current = requestAnimationFrame(animate)
        }

        animate()
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    const handleKeyPress = (e: KeyboardEvent) => {
      resetTimer()
    }

    const handleClick = () => {
      resetTimer()
    }

    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("click", handleClick)

    return () => {
      clearInterval(timeInterval)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("click", handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [resetTimer, mousePosition.x, mousePosition.y])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background/98 backdrop-blur-sm flex items-center justify-center">
      {/* Animated Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Main Content */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
        {/* Digital Clock */}
        <div className="mb-12">
          <div className="font-heading font-black text-6xl md:text-8xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatTime(currentTime)}
          </div>
          <div className="text-xl md:text-2xl text-muted-foreground mb-2">{formatDate(currentTime)}</div>
          <div className="text-sm text-muted-foreground">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
        </div>

        {/* Portfolio Branding */}
        <div className="mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
            <span className="text-3xl">💻</span>
          </div>
          <h2 className="font-heading font-black text-3xl md:text-4xl mb-4">Developer Portfolio</h2>
          <p className="text-muted-foreground mb-8">Interactive screensaver mode</p>
        </div>

        {/* Developer Quote */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="glass p-6 rounded-lg">
            <p className="text-lg italic text-muted-foreground mb-2">"{currentQuote}"</p>
            <p className="text-sm text-muted-foreground">— Developer Wisdom</p>
          </div>
        </div>

        {/* Wake Up Instructions */}
        <div className="animate-pulse">
          <p className="text-muted-foreground mb-4">Press any key or click to continue</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-secondary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-40px) translateX(-10px) rotate(180deg); 
            opacity: 0.9;
          }
          75% { 
            transform: translateY(-20px) translateX(-15px) rotate(270deg); 
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
