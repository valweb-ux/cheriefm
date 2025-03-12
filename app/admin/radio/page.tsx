"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Radio, Volume2, Play } from "lucide-react"

interface RadioSettings {
  id?: number
  stream_url: string
  station_name: string
  station_logo_url: string
  autoplay: boolean
  show_player: boolean
  show_volume_slider: boolean
  show_album_art: boolean
  show_station_logo: boolean
  default_volume: number
}

export default function RadioPlayerSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Налаштування радіоплеєра
  const [settings, setSettings] = useState<RadioSettings>({
    stream_url: "",
    station_name: "CherieFM",
    station_logo_url: "/placeholder.svg",
    autoplay: false,
    show_player: true,
    show_volume_slider: true,
    show_album_art: true,
    show_station_logo: true,
    default_volume: 80,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("radio_settings").select("*").single()

      if (error) {
        if (error.code !== "PGRST116") {
          // PGRST116 - not found
          throw error
        }
        // Якщо налаштувань немає, використовуємо значення за замовчуванням
        return
      }

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching radio settings:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити налаштування радіоплеєра",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)

      const { data, error } = await supabase.from("radio_settings").upsert([settings], { onConflict: "id" }).select()

      if (error) {
        throw error
      }

      toast({
        title: "Успіх",
        description: "Налаштування радіоплеєра збережено",
      })
    } catch (error) {
      console.error("Error saving radio settings:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти налаштування радіоплеєра",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <>
      <AdminPageHeader
        title="Налаштування радіоплеєра"
        description="Керуйте налаштуваннями онлайн-радіоплеєра"
        breadcrumbs={[{ label: "Адмінпанель", href: "/admin" }, { label: "Радіоплеєр" }]}
        actions={
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Зберегти налаштування
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCard>
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Основні налаштування</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="stream_url" className="font-medium">
                      URL потоку радіостанції
                    </Label>
                    <Input
                      id="stream_url"
                      value={settings.stream_url}
                      onChange={(e) => setSettings({ ...settings, stream_url: e.target.value })}
                      placeholder="https://example.com/stream"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Введіть URL онлайн-потоку радіостанції (Icecast/Shoutcast)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="station_name" className="font-medium">
                      Назва радіостанції
                    </Label>
                    <Input
                      id="station_name"
                      value={settings.station_name}
                      onChange={(e) => setSettings({ ...settings, station_name: e.target.value })}
                      placeholder="CherieFM"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="station_logo_url" className="font-medium">
                      URL логотипу радіостанції
                    </Label>
                    <Input
                      id="station_logo_url"
                      value={settings.station_logo_url}
                      onChange={(e) => setSettings({ ...settings, station_logo_url: e.target.value })}
                      placeholder="/placeholder.svg"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">Рекомендований розмір: 300x300 пікселів</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Налаштування відображення</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_player" className="font-medium">
                        Відображати плеєр
                      </Label>
                      <p className="text-sm text-gray-500">Показувати радіоплеєр на сторінці користувача</p>
                    </div>
                    <Switch
                      id="show_player"
                      checked={settings.show_player}
                      onCheckedChange={(checked) => setSettings({ ...settings, show_player: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoplay" className="font-medium">
                        Автоматичне відтворення
                      </Label>
                      <p className="text-sm text-gray-500">
                        Автоматично починати відтворення при завантаженні сторінки
                      </p>
                    </div>
                    <Switch
                      id="autoplay"
                      checked={settings.autoplay}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_volume_slider" className="font-medium">
                        Показувати повзунок гучності
                      </Label>
                      <p className="text-sm text-gray-500">Елемент управління гучністю</p>
                    </div>
                    <Switch
                      id="show_volume_slider"
                      checked={settings.show_volume_slider}
                      onCheckedChange={(checked) => setSettings({ ...settings, show_volume_slider: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_album_art" className="font-medium">
                        Показувати обкладинку пісні
                      </Label>
                      <p className="text-sm text-gray-500">Зображення поточної пісні, якщо доступно</p>
                    </div>
                    <Switch
                      id="show_album_art"
                      checked={settings.show_album_art}
                      onCheckedChange={(checked) => setSettings({ ...settings, show_album_art: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_station_logo" className="font-medium">
                        Показувати логотип радіостанції
                      </Label>
                      <p className="text-sm text-gray-500">Якщо обкладинка пісні недоступна</p>
                    </div>
                    <Switch
                      id="show_station_logo"
                      checked={settings.show_station_logo}
                      onCheckedChange={(checked) => setSettings({ ...settings, show_station_logo: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default_volume" className="font-medium">
                      Гучність за замовчуванням: {settings.default_volume}%
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="default_volume"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.default_volume]}
                        onValueChange={(value) => setSettings({ ...settings, default_volume: value[0] })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        <div>
          <AdminCard title="Попередній перегляд">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg">
                <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                  <Radio size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{settings.station_name}</div>
                  <div className="text-xs text-gray-400">Зараз в ефірі</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <Play size={16} className="ml-0.5" />
                  </button>
                  {settings.show_volume_slider && (
                    <div className="flex items-center gap-1">
                      <Volume2 size={16} />
                      <div className="w-16 h-1 bg-gray-600 rounded-full">
                        <div
                          className="h-1 bg-white rounded-full"
                          style={{ width: `${settings.default_volume}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-center text-gray-500">
                Це спрощений попередній перегляд. Реальний плеєр може відрізнятися.
              </div>
            </div>
          </AdminCard>

          <div className="mt-6">
            <AdminCard title="Інформація">
              <div className="p-4 space-y-4">
                <p className="text-sm">
                  Налаштуйте радіоплеєр відповідно до ваших потреб. Після збереження налаштувань, плеєр буде
                  відображатися на сторінці користувача згідно з вашими параметрами.
                </p>

                <div className="text-sm">
                  <h4 className="font-medium mb-2">Підтримувані формати потоків:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>MP3 (Icecast/Shoutcast)</li>
                    <li>AAC</li>
                    <li>HLS</li>
                  </ul>
                </div>

                <div className="text-sm">
                  <h4 className="font-medium mb-2">Поради:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Використовуйте прямі URL до аудіопотоків</li>
                    <li>Для логотипів рекомендується використовувати зображення розміром 300x300 пікселів</li>
                    <li>Перевірте працездатність потоку перед збереженням</li>
                    <li>Автоматичне відтворення може не працювати в деяких браузерах через їх політику</li>
                  </ul>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </>
  )
}

