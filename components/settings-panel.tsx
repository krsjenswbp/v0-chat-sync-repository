"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Keyboard, Moon, Sun, Monitor, RotateCcw } from "lucide-react"
import { usePreferences } from "@/hooks/use-preferences"
import { useTheme } from "next-themes"

export function SettingsPanel() {
  const { preferences, updatePreference, resetPreferences } = usePreferences()
  const { theme, setTheme } = useTheme()

  const shortcuts = [
    { key: "Esc", description: "Exit screensaver" },
    { key: "Ctrl + K", description: "Open command palette" },
    { key: "Ctrl + /", description: "Show keyboard shortcuts" },
    { key: "Ctrl + ,", description: "Open settings" },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="glass">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Portfolio Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Screensaver Settings */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Screensaver</h3>
            <div className="space-y-4">
              <div>
                <Label>Timeout: {Math.round(preferences.screensaverTimeout / 1000)}s</Label>
                <Slider
                  value={[preferences.screensaverTimeout]}
                  onValueChange={([value]) => updatePreference("screensaverTimeout", value)}
                  min={10000}
                  max={300000}
                  step={5000}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Mouse Sensitivity: {preferences.mouseSensitivity}%</Label>
                <Slider
                  value={[preferences.mouseSensitivity]}
                  onValueChange={([value]) => updatePreference("mouseSensitivity", value)}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Advanced Features */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Advanced Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Wake Lock</Label>
                  <p className="text-sm text-muted-foreground">Prevent screen from sleeping during presentation</p>
                </div>
                <Switch
                  checked={preferences.enableWakeLock}
                  onCheckedChange={(checked) => updatePreference("enableWakeLock", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Keyboard Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">Enable keyboard shortcuts for quick actions</p>
                </div>
                <Switch
                  checked={preferences.enableKeyboardShortcuts}
                  onCheckedChange={(checked) => updatePreference("enableKeyboardShortcuts", checked)}
                />
              </div>

              <div>
                <Label>Auto-save Interval: {preferences.autoSaveInterval / 1000}s</Label>
                <Slider
                  value={[preferences.autoSaveInterval]}
                  onValueChange={([value]) => updatePreference("autoSaveInterval", value)}
                  min={1000}
                  max={30000}
                  step={1000}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcut.key}</kbd>
                </div>
              ))}
            </div>
          </Card>

          {/* Reset Settings */}
          <div className="flex justify-end">
            <Button onClick={resetPreferences} variant="outline" className="bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
