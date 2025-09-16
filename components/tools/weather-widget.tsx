"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, MapPin, Thermometer, Droplets, Wind, Eye } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  icon: string
}

export function WeatherWidget() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes("rain") || lower.includes("drizzle")) return CloudRain
    if (lower.includes("cloud")) return Cloud
    return Sun
  }

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // For demo purposes, we'll simulate weather data
      // In a real app, you'd use a weather API like OpenWeatherMap
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const mockWeatherData: WeatherData = {
        location: city,
        temperature: Math.round(Math.random() * 30 + 5), // 5-35°C
        condition: ["Sunny", "Cloudy", "Partly Cloudy", "Light Rain", "Clear"][Math.floor(Math.random() * 5)],
        humidity: Math.round(Math.random() * 40 + 30), // 30-70%
        windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
        visibility: Math.round(Math.random() * 5 + 5), // 5-10 km
        icon: "sunny",
      }

      setWeather(mockWeatherData)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setCity("Current Location")
          fetchWeather()
        },
        (error) => {
          setError("Unable to get your location")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather()
    }
  }

  const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Cloud

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="city-input">City Name</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="city-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="flex-1"
            />
            <Button onClick={fetchWeather} disabled={isLoading}>
              {isLoading ? "Loading..." : "Get Weather"}
            </Button>
          </div>
        </div>

        <Button onClick={getCurrentLocation} variant="outline" className="w-full bg-transparent">
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>

        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">{error}</div>}
      </div>

      {weather && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <WeatherIcon className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{weather.location}</h2>
            <div className="text-4xl font-bold text-primary mb-2">{weather.temperature}°C</div>
            <p className="text-muted-foreground">{weather.condition}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Feels like</div>
              <div className="font-semibold">{weather.temperature + Math.round(Math.random() * 4 - 2)}°C</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Droplets className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Wind className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Wind Speed</div>
              <div className="font-semibold">{weather.windSpeed} km/h</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="font-semibold">{weather.visibility} km</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </Card>
      )}
    </div>
  )
}
