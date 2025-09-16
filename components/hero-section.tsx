"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <Card className="glass p-6 md:p-8 mb-6">
        <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          John Developer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
          Full-Stack Developer & Digital Craftsman
        </p>
        <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
          I create beautiful, functional web applications and developer tools. Welcome to my interactive portfolio where
          design meets functionality.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button size="default" className="glass group">
            View My Work
            <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </Button>
          <Button variant="outline" size="default" className="glass bg-transparent">
            Download Resume
          </Button>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="ghost" size="icon" className="glass">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="glass">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="glass">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
