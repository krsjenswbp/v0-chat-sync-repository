"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { GitCompare, RotateCcw } from "lucide-react"

export function TextDiff() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [diff, setDiff] = useState<Array<{ type: "equal" | "delete" | "insert"; value: string }>>([])

  const generateDiff = () => {
    // Simple diff algorithm (for demo purposes)
    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")
    const result: Array<{ type: "equal" | "delete" | "insert"; value: string }> = []

    const maxLines = Math.max(lines1.length, lines2.length)

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ""
      const line2 = lines2[i] || ""

      if (line1 === line2) {
        if (line1) {
          result.push({ type: "equal", value: line1 })
        }
      } else {
        if (line1 && !line2) {
          result.push({ type: "delete", value: line1 })
        } else if (!line1 && line2) {
          result.push({ type: "insert", value: line2 })
        } else if (line1 && line2) {
          result.push({ type: "delete", value: line1 })
          result.push({ type: "insert", value: line2 })
        }
      }
    }

    setDiff(result)
  }

  const clearAll = () => {
    setText1("")
    setText2("")
    setDiff([])
  }

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text1">Original Text</Label>
            <Textarea
              id="text1"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter original text..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="text2">Modified Text</Label>
            <Textarea
              id="text2"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter modified text..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generateDiff} className="flex-1">
          <GitCompare className="h-4 w-4 mr-2" />
          Compare Texts
        </Button>
        <Button onClick={swapTexts} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Swap
        </Button>
        <Button onClick={clearAll} variant="outline">
          Clear
        </Button>
      </div>

      {diff.length > 0 && (
        <Card className="p-4">
          <Label className="mb-4 block">Differences</Label>
          <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
            {diff.map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  item.type === "equal"
                    ? "bg-muted/50"
                    : item.type === "delete"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                }`}
              >
                <span className="inline-block w-4 text-xs mr-2">
                  {item.type === "delete" ? "-" : item.type === "insert" ? "+" : " "}
                </span>
                {item.value || "(empty line)"}
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 dark:bg-red-900/50 rounded"></div>
                Deleted: {diff.filter((d) => d.type === "delete").length} lines
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 dark:bg-green-900/50 rounded"></div>
                Added: {diff.filter((d) => d.type === "insert").length} lines
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-muted rounded"></div>
                Unchanged: {diff.filter((d) => d.type === "equal").length} lines
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
