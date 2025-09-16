"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Palette, Key, Link, FileText, Hash, ImageIcon, GitCompare, Search, Cloud } from "lucide-react"
import { QRGenerator } from "@/components/tools/qr-generator"
import { ColorPicker } from "@/components/tools/color-picker"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { URLShortener } from "@/components/tools/url-shortener"
import { JSONFormatter } from "@/components/tools/json-formatter"
import { HashGenerator } from "@/components/tools/hash-generator"
import { ImageConverter } from "@/components/tools/image-converter"
import { TextDiff } from "@/components/tools/text-diff"
import { CustomSearch } from "@/components/tools/custom-search"
import { WeatherWidget } from "@/components/tools/weather-widget"

const tools = [
  {
    id: "qr-generator",
    title: "QR Generator",
    description: "Generate QR codes for URLs, text, and more",
    icon: QrCode,
    color: "from-blue-500 to-cyan-500",
    component: QRGenerator,
  },
  {
    id: "color-picker",
    title: "Color Picker",
    description: "Advanced color picker and palette generator",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    component: ColorPicker,
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Secure password generator with custom options",
    icon: Key,
    color: "from-green-500 to-emerald-500",
    component: PasswordGenerator,
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Shorten URLs with click tracking",
    icon: Link,
    color: "from-orange-500 to-red-500",
    component: URLShortener,
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON with syntax highlighting",
    icon: FileText,
    color: "from-indigo-500 to-blue-500",
    component: JSONFormatter,
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes",
    icon: Hash,
    color: "from-teal-500 to-cyan-500",
    component: HashGenerator,
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert and optimize images",
    icon: ImageIcon,
    color: "from-pink-500 to-rose-500",
    component: ImageConverter,
  },
  {
    id: "text-diff",
    title: "Text Diff",
    description: "Compare text and highlight differences",
    icon: GitCompare,
    color: "from-yellow-500 to-orange-500",
    component: TextDiff,
  },
  {
    id: "custom-search",
    title: "Custom Search",
    description: "Search across multiple providers",
    icon: Search,
    color: "from-violet-500 to-purple-500",
    component: CustomSearch,
  },
  {
    id: "weather-widget",
    title: "Weather Widget",
    description: "Real-time weather information",
    icon: Cloud,
    color: "from-sky-500 to-blue-500",
    component: WeatherWidget,
  },
]

interface ToolsGridProps {
  selectedTool?: string | null
  onToolSelect?: (toolId: string | null) => void
}

export function ToolsGrid({ selectedTool, onToolSelect }: ToolsGridProps) {
  const [internalSelectedTool, setInternalSelectedTool] = useState<string | null>(null)

  const currentSelectedTool = selectedTool !== undefined ? selectedTool : internalSelectedTool
  const setSelectedTool = onToolSelect || setInternalSelectedTool

  const currentTool = tools.find((tool) => tool.id === currentSelectedTool)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <Card key={index} className="glass p-4 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <tool.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-heading font-bold text-base mb-2">{tool.title}</h3>
            <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{tool.description}</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full glass group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs"
              onClick={() => setSelectedTool(tool.id)}
            >
              Open Tool
            </Button>
          </Card>
        ))}
      </div>

      {/* Tool Modal */}
      <Dialog open={!!currentSelectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentTool && (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentTool.color} flex items-center justify-center`}
                  >
                    <currentTool.icon className="h-4 w-4 text-white" />
                  </div>
                  {currentTool.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {currentTool && <currentTool.component />}
        </DialogContent>
      </Dialog>
    </>
  )
}
