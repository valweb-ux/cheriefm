"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Radio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"
import type { SiteSettings } from "@/types/settings.types"

interface StreamingSettingsFormProps {
  settings: SiteSettings
}

export function StreamingSettingsForm({ settings }: StreamingSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [streamingEnabled, setStreamingEnabled] = useState(settings.streaming_enabled || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateSiteSettingsAction(formData)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти налаштування",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Налаштування стрімінгу</h3>

              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="streaming_enabled"
                    name="streaming_enabled"
                    checked={streamingEnabled}
                    onCheckedChange={setStreamingEnabled}
                  />
                  <Label htmlFor="streaming_enabled">Увімкнути стрімінг</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streaming_url">URL стрімінгу</Label>
                  <Input
                    id="streaming_url"
                    name="streaming_url"
                    defaultValue={settings.streaming_url || ""}
                    placeholder="https://stream.example.com/live"
                    disabled={!streamingEnabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Вкажіть URL потоку вашої радіостанції (Icecast, Shoutcast або інший формат)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streaming_format">Формат стрімінгу</Label>
                  <select
                    id="streaming_format"
                    name="streaming_format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={settings.streaming_format || "mp3"}
                    disabled={!streamingEnabled}
                  >
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                    <option value="ogg">OGG</option>
                    <option value="hls">HLS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streaming_bitrate">Бітрейт (kbps)</Label>
                  <Input
                    id="streaming_bitrate"
                    name="streaming_bitrate"
                    type="number"
                    defaultValue={settings.streaming_bitrate || "128"}
                    placeholder="128"
                    disabled={!streamingEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streaming_metadata_url">URL метаданих (опціонально)</Label>
                  <Input
                    id="streaming_metadata_url"
                    name="streaming_metadata_url"
                    defaultValue={settings.streaming_metadata_url || ""}
                    placeholder="https://api.example.com/nowplaying"
                    disabled={!streamingEnabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Якщо у вас є окремий API для отримання інформації про поточний трек, вкажіть його URL
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Тестування стрімінгу</h3>

              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Radio className="text-primary" size={24} />
                  <div>
                    <p className="font-medium">Перевірте ваш стрімінг</p>
                    <p className="text-sm text-muted-foreground">
                      Після збереження налаштувань ви можете перевірити роботу стрімінгу на сторінці радіо
                    </p>
                  </div>

                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        window.open("/radio", "_blank")
                      }}
                    >
                      Перейти до сторінки радіо
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
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
      </div>
    </form>
  )
}

