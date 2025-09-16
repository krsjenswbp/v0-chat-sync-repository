"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Copy, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#0891b2")
  const [palette, setPalette] = useState<string[]>([])
  const { toast } = useToast()

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const generatePalette = () => {
    const baseHsl = hexToHsl(selectedColor)
    if (!baseHsl) return

    const colors = []

    // Generate complementary and analogous colors
    for (let i = 0; i < 8; i++) {
      const hue = (baseHsl.h + i * 45) % 360
      const saturation = Math.max(20, baseHsl.s + (i % 2 === 0 ? -10 : 10))
      const lightness = Math.max(20, Math.min(80, baseHsl.l + (i % 3 === 0 ? -20 : i % 3 === 1 ? 0 : 20)))

      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }

    setPalette(colors)
  }

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`,
    })
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = hexToHsl(selectedColor)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="color-input">Color Picker</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                id="color-input"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Color Values</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">HEX:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(selectedColor)}
                  className="font-mono text-sm"
                >
                  {selectedColor} <Copy className="h-3 w-3 ml-1" />
                </Button>
              </div>

              {rgb && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">RGB:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                    className="font-mono text-sm"
                  >
                    rgb({rgb.r}, {rgb.g}, {rgb.b}) <Copy className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}

              {hsl && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">HSL:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                    className="font-mono text-sm"
                  >
                    hsl({hsl.h}, {hsl.s}%, {hsl.l}%) <Copy className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Button onClick={generatePalette} className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            Generate Palette
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="w-full h-32 rounded-lg border border-border" style={{ backgroundColor: selectedColor }} />
          </Card>

          {palette.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Generated Palette</h3>
              <div className="grid grid-cols-4 gap-2">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded cursor-pointer hover:scale-105 transition-transform border border-border"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                    title={`Click to copy: ${color}`}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
