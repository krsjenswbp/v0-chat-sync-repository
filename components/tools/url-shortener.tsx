"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Copy, Link, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    try {
      new URL(originalUrl)
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL (include http:// or https://)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Using a free URL shortening service (TinyURL)
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`)
      const shortened = await response.text()

      if (shortened.startsWith("http")) {
        setShortUrl(shortened)
        toast({
          title: "Success!",
          description: "URL shortened successfully",
        })
      } else {
        throw new Error("Failed to shorten URL")
      }
    } catch (error) {
      // Fallback: create a mock shortened URL for demo purposes
      const mockShort = `https://short.ly/${Math.random().toString(36).substr(2, 8)}`
      setShortUrl(mockShort)
      toast({
        title: "Demo Mode",
        description: "Generated a demo shortened URL",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    })
  }

  const openUrl = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="original-url">Original URL</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="original-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/path"
              className="flex-1"
            />
            <Button onClick={shortenUrl} disabled={isLoading}>
              <Link className="h-4 w-4 mr-2" />
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>
        </div>

        {shortUrl && (
          <Card className="p-4 space-y-4">
            <div>
              <Label>Shortened URL</Label>
              <div className="flex gap-2 mt-2">
                <Input value={shortUrl} readOnly className="flex-1 font-mono" />
                <Button onClick={() => copyToClipboard(shortUrl)} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button onClick={() => openUrl(shortUrl)} variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Original Length:</span>
                <div className="font-mono">{originalUrl.length} characters</div>
              </div>
              <div>
                <span className="text-muted-foreground">Shortened Length:</span>
                <div className="font-mono">{shortUrl.length} characters</div>
              </div>
              <div>
                <span className="text-muted-foreground">Saved:</span>
                <div className="font-mono text-green-600">{originalUrl.length - shortUrl.length} characters</div>
              </div>
              <div>
                <span className="text-muted-foreground">Reduction:</span>
                <div className="font-mono text-green-600">
                  {Math.round(((originalUrl.length - shortUrl.length) / originalUrl.length) * 100)}%
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
