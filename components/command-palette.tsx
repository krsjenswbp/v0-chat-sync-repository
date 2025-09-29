"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, Search, Settings, Palette, Key, QrCode, Hash } from "lucide-react"

interface CommandItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenTool: (toolId: string) => void
  onOpenSettings: () => void
}

export function CommandPalette({ isOpen, onClose, onOpenTool, onOpenSettings }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: CommandItem[] = [
    {
      id: "settings",
      title: "Open Settings",
      description: "Configure portfolio preferences",
      icon: Settings,
      action: () => {
        onOpenSettings()
        onClose()
      },
      keywords: ["settings", "preferences", "config"],
    },
    {
      id: "qr-generator",
      title: "QR Code Generator",
      description: "Generate QR codes for URLs and text",
      icon: QrCode,
      action: () => {
        onOpenTool("qr-generator")
        onClose()
      },
      keywords: ["qr", "code", "generator", "url"],
    },
    {
      id: "color-picker",
      title: "Color Picker",
      description: "Pick colors and generate palettes",
      icon: Palette,
      action: () => {
        onOpenTool("color-picker")
        onClose()
      },
      keywords: ["color", "picker", "palette", "hex", "rgb"],
    },
    {
      id: "password-generator",
      title: "Password Generator",
      description: "Generate secure passwords",
      icon: Key,
      action: () => {
        onOpenTool("password-generator")
        onClose()
      },
      keywords: ["password", "generator", "secure", "random"],
    },
    {
      id: "hash-generator",
      title: "Hash Generator",
      description: "Generate MD5, SHA1, SHA256 hashes",
      icon: Hash,
      action: () => {
        onOpenTool("hash-generator")
        onClose()
      },
      keywords: ["hash", "md5", "sha1", "sha256", "crypto"],
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
        break
      case "Escape":
        onClose()
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 glass" onKeyDown={handleKeyDown}>
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Command className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  className={`w-full justify-start p-3 h-auto ${
                    index === selectedIndex ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={command.action}
                >
                  <command.icon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{command.title}</div>
                    <div className="text-sm text-muted-foreground">{command.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
