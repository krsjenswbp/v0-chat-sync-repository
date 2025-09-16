"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Copy, RefreshCw, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let result = ""
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(result)
  }

  const copyToClipboard = () => {
    if (!password) return

    navigator.clipboard.writeText(password)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "No password", color: "text-muted-foreground" }

    let score = 0

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" }
    if (score <= 4) return { score, label: "Medium", color: "text-yellow-500" }
    return { score, label: "Strong", color: "text-green-500" }
  }

  const strength = getPasswordStrength()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Password Length: {length[0]}</Label>
            <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="mt-2" />
          </div>

          <div className="space-y-3">
            <Label>Character Types</Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="exclude-similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
              <Label htmlFor="exclude-similar">Exclude similar characters (il1Lo0O)</Label>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Password
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <Label>Generated Password</Label>
            <div className="flex gap-2 mt-2">
              <Input value={password} readOnly placeholder="Click generate to create password" className="font-mono" />
              <Button onClick={copyToClipboard} disabled={!password} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {password && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4" />
                <Label>Security Analysis</Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Strength:</span>
                  <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      strength.score <= 2 ? "bg-red-500" : strength.score <= 4 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(strength.score / 6) * 100}%` }}
                  />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Length: {password.length} characters</div>
                  <div>Entropy: ~{Math.log2(Math.pow(95, password.length)).toFixed(0)} bits</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
