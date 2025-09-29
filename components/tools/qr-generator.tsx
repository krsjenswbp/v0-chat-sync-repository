"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function QRGenerator() {
  const [text, setText] = useState("")
  const [size, setSize] = useState("200")
  const [errorLevel, setErrorLevel] = useState("M")
  const [qrUrl, setQrUrl] = useState("")
  const { toast } = useToast()

  const generateQR = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text or URL to generate QR code",
        variant: "destructive",
      })
      return
    }

    const encodedText = encodeURIComponent(text)
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&ecc=${errorLevel}`
    setQrUrl(url)
  }

  const downloadQR = () => {
    if (!qrUrl) return

    const link = document.createElement("a")
    link.href = qrUrl
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = () => {
    if (!qrUrl) return

    navigator.clipboard.writeText(qrUrl)
    toast({
      title: "Success",
      description: "QR code URL copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="qr-text">Text or URL</Label>
            <Textarea
              id="qr-text"
              placeholder="Enter text, URL, or any data..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qr-size">Size (px)</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150x150</SelectItem>
                  <SelectItem value="200">200x200</SelectItem>
                  <SelectItem value="300">300x300</SelectItem>
                  <SelectItem value="400">400x400</SelectItem>
                  <SelectItem value="500">500x500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="error-level">Error Correction</Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generateQR} className="w-full">
            Generate QR Code
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {qrUrl ? (
            <Card className="p-4">
              <img src={qrUrl || "/placeholder.svg"} alt="Generated QR Code" className="max-w-full h-auto" />
            </Card>
          ) : (
            <Card className="p-8 flex items-center justify-center min-h-[200px] w-full">
              <p className="text-muted-foreground text-center">QR code will appear here</p>
            </Card>
          )}

          {qrUrl && (
            <div className="flex gap-2">
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
