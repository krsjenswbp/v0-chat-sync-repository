"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Upload, Download, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setConvertedImage(null)
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        })
      }
    }
  }

  const convertImage = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file first",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        if (ctx) {
          ctx.drawImage(img, 0, 0)

          const quality = outputFormat === "jpeg" ? 0.9 : undefined
          const dataUrl = canvas.toDataURL(`image/${outputFormat}`, quality)
          setConvertedImage(dataUrl)

          toast({
            title: "Success!",
            description: `Image converted to ${outputFormat.toUpperCase()}`,
          })
        }
        setIsConverting(false)
      }

      img.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load image",
          variant: "destructive",
        })
        setIsConverting(false)
      }

      img.src = URL.createObjectURL(selectedFile)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert image",
        variant: "destructive",
      })
      setIsConverting(false)
    }
  }

  const downloadImage = () => {
    if (!convertedImage) return

    const link = document.createElement("a")
    link.href = convertedImage
    link.download = `converted-image.${outputFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Select Image</Label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <Card
              className="p-8 border-dashed border-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={triggerFileInput}
            >
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to select an image file"}
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Label htmlFor="output-format">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={convertImage} disabled={!selectedFile || isConverting} className="w-full">
            <ImageIcon className="h-4 w-4 mr-2" />
            {isConverting ? "Converting..." : "Convert Image"}
          </Button>
        </div>

        <div className="space-y-4">
          <Label>Preview & Download</Label>

          {selectedFile && (
            <Card className="p-4">
              <Label className="text-sm text-muted-foreground">Original Image</Label>
              <img
                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                alt="Original"
                className="w-full h-auto max-h-48 object-contain rounded mt-2"
              />
              <div className="text-xs text-muted-foreground mt-2">Size: {(selectedFile.size / 1024).toFixed(1)} KB</div>
            </Card>
          )}

          {convertedImage && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Converted Image</Label>
                <Button onClick={downloadImage} size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <img
                src={convertedImage || "/placeholder.svg"}
                alt="Converted"
                className="w-full h-auto max-h-48 object-contain rounded"
              />
              <div className="text-xs text-muted-foreground mt-2">Format: {outputFormat.toUpperCase()}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
