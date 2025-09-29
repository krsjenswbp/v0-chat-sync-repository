"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, ExternalLink } from "lucide-react"

const searchProviders = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { id: "github", name: "GitHub", url: "https://github.com/search?q=" },
  { id: "stackoverflow", name: "Stack Overflow", url: "https://stackoverflow.com/search?q=" },
  { id: "mdn", name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/search?q=" },
  { id: "npm", name: "npm", url: "https://www.npmjs.com/search?q=" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
]

export function CustomSearch() {
  const [query, setQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("google")
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; provider: string; timestamp: Date }>>([])

  const performSearch = () => {
    if (!query.trim()) return

    const provider = searchProviders.find((p) => p.id === selectedProvider)
    if (!provider) return

    const searchUrl = provider.url + encodeURIComponent(query)

    // Add to history
    setSearchHistory((prev) => [
      { query, provider: provider.name, timestamp: new Date() },
      ...prev.slice(0, 9), // Keep only last 10 searches
    ])

    // Open in new tab
    window.open(searchUrl, "_blank")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch()
    }
  }

  const searchFromHistory = (historyItem: (typeof searchHistory)[0]) => {
    setQuery(historyItem.query)
    const provider = searchProviders.find((p) => p.name === historyItem.provider)
    if (provider) {
      setSelectedProvider(provider.id)
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="search-query">Search Query</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your search query..."
              className="flex-1"
            />
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={performSearch} disabled={!query.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {searchProviders.map((provider) => (
            <Button
              key={provider.id}
              variant={selectedProvider === provider.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProvider(provider.id)}
              className="text-xs"
            >
              {provider.name}
            </Button>
          ))}
        </div>
      </div>

      {searchHistory.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Search History</Label>
            <Button onClick={clearHistory} variant="outline" size="sm">
              Clear History
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer group"
                onClick={() => searchFromHistory(item)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm truncate">{item.query}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.provider} • {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
