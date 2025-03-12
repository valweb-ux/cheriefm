"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Radio, Volume2, Play } from "lucide-react"

interface RadioSettings {
  id?: number
  show_controls: boolean
  show_volume_slider: boolean
  show_stations_list: boolean
  show_cover_art: boolean
  default_volume: number
  autoplay: boolean
  default_station: string
  fallback_cover_image: string
  show_player_on_site: boolean
}

export default function RadioPlayerSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Налаштування радіоплеєра
  const [settings, setSettings] = useState<RadioSettings>({
    show_controls: true,
    show_volume_slider: true,
    show_stations_list: true,
    show_cover_art: true,
    default_volume: 80,
    autoplay: false,
    default_station: "",
    fallback_cover_image: "/placeholder.svg",
    show_player_on_site: true,
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
      console.error("Помилка при отриманні налаштувань радіоплеєра:", error)
      alert("Не вдалося завантажити налаштування радіоплеєра")
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)

      const { data, error } = await supabase.from("radio_settings").upsert([settings], { onConflict: "id" }).select()

      if (error) {
        console.error("Помилка при збереженні налаштувань:", error)
        throw new Error(`Помилка при збереженні: ${error.message}`)
      }

      console.log("Налаштування успішно збережено:", data)
      alert("Налаштування радіоплеєра успішно збережено!")
    } catch (error) {
      console.error("Помилка при збереженні налаштувань радіоплеєра:", error)
      alert(
        `Не вдалося зберегти налаштування радіоплеєра: ${error instanceof Error ? error.message : "Невідома помилка"}`,
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  return (
    <div>
      <h1 className="admin-page-title">Налаштування радіоплеєра</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Налаштуйте параметри радіоплеєра для вашого сайту. Ці налаштування впливають на відображення та
          функціональність плеєра.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Основні налаштування</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Відображати плеєр на сайті</label>
                    <p className="text-sm text-gray-500">Показувати радіоплеєр на сторінці користувача</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.show_player_on_site}
                      onChange={(e) => setSettings({ ...settings, show_player_on_site: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Показувати елементи керування</label>
                    <p className="text-sm text-gray-500">Кнопки відтворення, паузи тощо</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.show_controls}
                      onChange={(e) => setSettings({ ...settings, show_controls: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Показувати список станцій</label>
                    <p className="text-sm text-gray-500">Можливість вибору радіостанції</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.show_stations_list}
                      onChange={(e) => setSettings({ ...settings, show_stations_list: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label className="quick-draft-label">URL зображення за замовчуванням</label>
                <input
                  type="text"
                  value={settings.fallback_cover_image}
                  onChange={(e) => setSettings({ ...settings, fallback_cover_image: e.target.value })}
                  placeholder="/placeholder.svg"
                  className="admin-form-input"
                />
                <p className="text-sm text-gray-500 mt-1">Використовується, якщо обкладинка пісні недоступна</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label className="quick-draft-label">Станція за замовчуванням</label>
                <input
                  type="text"
                  value={settings.default_station}
                  onChange={(e) => setSettings({ ...settings, default_station: e.target.value })}
                  placeholder="ID станції за замовчуванням"
                  className="admin-form-input"
                />
              </div>
            </div>
          </div>

          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Налаштування відображення</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Автоматичне відтворення</label>
                    <p className="text-sm text-gray-500">Автоматично починати відтворення при завантаженні сторінки</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.autoplay}
                      onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Показувати повзунок гучності</label>
                    <p className="text-sm text-gray-500">Елемент управління гучністю</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.show_volume_slider}
                      onChange={(e) => setSettings({ ...settings, show_volume_slider: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label className="quick-draft-label">Показувати обкладинку</label>
                    <p className="text-sm text-gray-500">Зображення поточної пісні, якщо доступно</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.show_cover_art}
                      onChange={(e) => setSettings({ ...settings, show_cover_art: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label className="quick-draft-label">Гучність за замовчуванням: {settings.default_volume}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.default_volume}
                  onChange={(e) => setSettings({ ...settings, default_volume: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/admin" className="admin-button admin-button-secondary" style={{ marginRight: "10px" }}>
              Скасувати
            </Link>
            <button
              type="button"
              onClick={saveSettings}
              className="admin-button admin-button-primary"
              disabled={isSaving}
            >
              {isSaving ? "Збереження..." : "Зберегти налаштування"}
            </button>
          </div>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Попередній перегляд</h2>
            </div>
            <div className="dashboard-widget-content">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg">
                  <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                    <Radio size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">CherieFM</div>
                    <div className="text-xs text-gray-400">Зараз в ефірі</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.show_controls && (
                      <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                        <Play size={16} className="ml-0.5" />
                      </button>
                    )}
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
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Інформація</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <h4 className="font-medium mb-2">Підтримувані формати потоків:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>MP3 (Icecast/Shoutcast)</li>
                  <li>AAC</li>
                  <li>HLS</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Поради:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Використовуйте прямі URL до аудіопотоків</li>
                  <li>Для логотипів рекомендується використовувати зображення розміром 300x300 пікселів</li>
                  <li>Перевірте працездатність потоку перед збереженням</li>
                  <li>Автоматичне відтворення може не працювати в деяких браузерах через їх політику</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

