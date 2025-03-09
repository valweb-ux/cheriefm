"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getRadioAdvertSettings, updateRadioAdvertSettings } from "@/lib/services/radio-adverts-service"
import type { RadioAdvertSettings } from "@/types/radio.types"

export function RadioAdvertSettingsForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState<RadioAdvertSettings>({
    enabled: true,
    playBeforeStream: true,
    rotateAdverts: true,
    skipEnabled: true,
    skipAfterSeconds: 5,
    sessionTimeout: 60,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Завантаження налаштувань
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getRadioAdvertSettings()
        setSettings(data)
      } catch (error) {
        console.error("Error loading advert settings:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити налаштування реклами",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateRadioAdvertSettings(settings)

      toast({
        title: "Успішно",
        description: "Налаштування реклами збережено",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти налаштування реклами",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Загальні налаштування реклами</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="enabled">Увімкнути рекламу</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="playBeforeStream"
                  checked={settings.playBeforeStream}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, playBeforeStream: checked }))}
                  disabled={!settings.enabled}
                />
                <Label htmlFor="playBeforeStream">Відтворювати рекламу перед початком стрімінгу</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="rotateAdverts"
                  checked={settings.rotateAdverts}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, rotateAdverts: checked }))}
                  disabled={!settings.enabled}
                />
                <Label htmlFor="rotateAdverts">Ротація рекламних роликів</Label>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Налаштування відтворення</h3>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skipEnabled"
                  checked={settings.skipEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, skipEnabled: checked }))}
                  disabled={!settings.enabled}
                />
                <Label htmlFor="skipEnabled">Дозволити пропускати рекламу</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skipAfterSeconds">Дозволити пропускати після (секунд)</Label>
                <Input
                  id="skipAfterSeconds"
                  type="number"
                  value={settings.skipAfterSeconds}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, skipAfterSeconds: Number.parseInt(e.target.value) }))
                  }
                  min={0}
                  max={30}
                  disabled={!settings.enabled || !settings.skipEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Кількість секунд, після яких користувач може пропустити рекламу
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Час сесії (хвилин)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                  }
                  min={1}
                  disabled={!settings.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  Час у хвилинах, після якого користувачу знову буде показана реклама
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Збереження...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Зберегти налаштування
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

