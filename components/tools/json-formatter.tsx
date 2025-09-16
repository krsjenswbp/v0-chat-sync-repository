"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Copy, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function JSONFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const formatJSON = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON to format",
        variant: "destructive",
      })
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setIsValid(true)
      setError("")
      toast({
        title: "Success!",
        description: "JSON formatted successfully",
      })
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      })
    }
  }

  const minifyJSON = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON to minify",
        variant: "destructive",
      })
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setError("")
      toast({
        title: "Success!",
        description: "JSON minified successfully",
      })
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    })
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="json-input">JSON Input</Label>
            <Textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30, "city": "New York"}'
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={formatJSON} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Format
            </Button>
            <Button onClick={minifyJSON} variant="outline" className="flex-1 bg-transparent">
              Minify
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>JSON Output</Label>
            {isValid !== null && (
              <div className="flex items-center gap-1 text-sm">
                {isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Valid JSON</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Invalid JSON</span>
                  </>
                )}
              </div>
            )}
          </div>

          {error ? (
            <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-700 dark:text-red-300">JSON Error</div>
                  <div className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="relative">
              <Textarea
                value={output}
                readOnly
                rows={12}
                className="font-mono text-sm"
                placeholder="Formatted JSON will appear here..."
              />
              {output && (
                <Button
                  onClick={() => copyToClipboard(output)}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {output && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Characters: {output.length}</div>
              <div>Lines: {output.split("\n").length}</div>
              <div>Size: {new Blob([output]).size} bytes</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
