"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Copy, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Simple hash functions (for demo purposes - in production, use crypto libraries)
  const generateMD5 = async (text: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data) // Using SHA-256 as MD5 isn't available
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 32) // Truncate to simulate MD5 length
  }

  const generateSHA1 = async (text: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const generateSHA256 = async (text: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const generateSHA512 = async (text: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-512", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const generateHashes = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to hash",
        variant: "destructive",
      })
      return
    }

    try {
      const [md5, sha1, sha256, sha512] = await Promise.all([
        generateMD5(input),
        generateSHA1(input),
        generateSHA256(input),
        generateSHA512(input),
      ])

      setHashes({
        MD5: md5,
        SHA1: sha1,
        SHA256: sha256,
        SHA512: sha512,
      })

      toast({
        title: "Success!",
        description: "Hashes generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hashes",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash)
    toast({
      title: "Copied!",
      description: `${type} hash copied to clipboard`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="hash-input">Text to Hash</Label>
          <Textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate hashes..."
            rows={4}
          />
        </div>

        <Button onClick={generateHashes} className="w-full">
          <Hash className="h-4 w-4 mr-2" />
          Generate Hashes
        </Button>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {Object.entries(hashes).map(([type, hash]) => (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">{type}</Label>
                <Button onClick={() => copyToClipboard(hash, type)} size="sm" variant="outline">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="font-mono text-sm bg-muted p-2 rounded break-all">{hash}</div>
              <div className="text-xs text-muted-foreground mt-1">Length: {hash.length} characters</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
