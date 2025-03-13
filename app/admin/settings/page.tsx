"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { Loader2 } from "lucide-react"

interface SiteSettings {
  site_title: string
  site_tagline: string
  site_icon_url: string
  site_url: string
  admin_email: string
  allow_registration: boolean
  default_role: string
  site_language: string
  timezone: string
  date_format: string
  time_format: string
  week_starts_on: string
}

const defaultSettings: SiteSettings = {
  site_title: "CherieFM",
  site_tagline: "Feel Good Music !",
  site_icon_url: "/placeholder.svg",
  site_url: "",
  admin_email: "",
  allow_registration: false,
  default_role: "user",
  site_language: "uk",
  timezone: "UTC+2",
  date_format: "F j, Y",
  time_format: "g:i a",
  week_starts_on: "monday",
}

const defaultSettingsFixed: SiteSettings = {
  ...defaultSettings,
  date_format: "d MMMM yyyy", // Changed from "F j, Y" which is PHP/WordPress format
  time_format: "HH:mm", // Changed from "g:i a" which is PHP/WordPress format
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettingsFixed)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [datePreview, setDatePreview] = useState("")
  const [timePreview, setTimePreview] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    updatePreviews()
  }, [settings.date_format, settings.time_format])

  const fetchSettings = async () => {
    setIsLoading(true) // Ensure setIsLoading is called unconditionally

    try {
      // First, ensure the settings table exists
      await fetch("/api/setup-settings-table")

      const response = await fetch("/api/settings")
      if (!response.ok) {
        console.error("Settings API error:", await response.text())
        // If we can't fetch settings, just use defaults
        setSettings(defaultSettingsFixed) // Set default settings on error
        return
      }

      const data = await response.json()
      if (data) {
        setSettings({
          ...defaultSettingsFixed,
          ...data,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      // Continue with default settings
      setSettings(defaultSettingsFixed) // Set default settings on error
    } finally {
      setIsLoading(false)
      // Make sure to update previews after loading settings
      setTimeout(updatePreviews, 0)
    }
  }

  const updatePreviews = () => {
    const now = new Date()
    setDatePreview(format(now, settings.date_format, { locale: uk }))
    setTimePreview(format(now, settings.time_format, { locale: uk }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      alert("Налаштування успішно збережено")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Помилка при збереженні налаштувань")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="admin-page-title">Загальні налаштування</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Налаштуйте основні параметри вашого сайту. Ці налаштування впливають на відображення та функціональність
          сайту.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: "1" }}>
            <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
              <div className="dashboard-widget-header">
                <h2 className="dashboard-widget-title">Основні налаштування</h2>
              </div>
              <div className="dashboard-widget-content space-y-4">
                <div>
                  <Label htmlFor="site_title">Назва сайту</Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div>
                  <Label htmlFor="site_tagline">Слоган</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline}
                    onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                    className="admin-form-input"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Коротко опишіть, про що цей сайт. Наприклад: "Feel Good Music !"
                  </p>
                </div>

                <div>
                  <Label htmlFor="site_url">URL сайту</Label>
                  <Input
                    id="site_url"
                    value={settings.site_url}
                    onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div>
                  <Label htmlFor="admin_email">Email адміністратора</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={settings.admin_email}
                    onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                    className="admin-form-input"
                  />
                  <p className="text-sm text-gray-500 mt-1">Ця адреса використовується для адміністративних цілей.</p>
                </div>
              </div>
            </div>

            <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
              <div className="dashboard-widget-header">
                <h2 className="dashboard-widget-title">Членство</h2>
              </div>
              <div className="dashboard-widget-content space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow_registration"
                    checked={settings.allow_registration}
                    onCheckedChange={(checked) => setSettings({ ...settings, allow_registration: checked })}
                  />
                  <Label htmlFor="allow_registration">Дозволити реєстрацію</Label>
                </div>

                <div>
                  <Label htmlFor="default_role">Роль за замовчуванням</Label>
                  <Select
                    value={settings.default_role}
                    onValueChange={(value) => setSettings({ ...settings, default_role: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Виберіть роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Користувач</SelectItem>
                      <SelectItem value="editor">Редактор</SelectItem>
                      <SelectItem value="admin">Адміністратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "280px" }}>
            <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
              <div className="dashboard-widget-header">
                <h2 className="dashboard-widget-title">Локалізація</h2>
              </div>
              <div className="dashboard-widget-content space-y-4">
                <div>
                  <Label htmlFor="site_language">Мова сайту</Label>
                  <Select
                    value={settings.site_language}
                    onValueChange={(value) => setSettings({ ...settings, site_language: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Виберіть мову" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">Українська</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Часовий пояс</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Виберіть часовий пояс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+0">UTC+0</SelectItem>
                      <SelectItem value="UTC+1">UTC+1</SelectItem>
                      <SelectItem value="UTC+2">UTC+2 (Київ)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Формат дати</Label>
                  <RadioGroup
                    value={settings.date_format}
                    onValueChange={(value) => setSettings({ ...settings, date_format: value })}
                    className="space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="d MMMM yyyy" id="date1" />
                      <Label htmlFor="date1">13 березня 2025</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yyyy-MM-dd" id="date2" />
                      <Label htmlFor="date2">2025-03-13</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MM/dd/yyyy" id="date3" />
                      <Label htmlFor="date3">03/13/2025</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dd/MM/yyyy" id="date4" />
                      <Label htmlFor="date4">13/03/2025</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-gray-500 mt-2">Попередній перегляд: {datePreview}</p>
                </div>

                <div>
                  <Label>Формат часу</Label>
                  <RadioGroup
                    value={settings.time_format}
                    onValueChange={(value) => setSettings({ ...settings, time_format: value })}
                    className="space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HH:mm" id="time1" />
                      <Label htmlFor="time1">15:30</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="h:mm a" id="time2" />
                      <Label htmlFor="time2">3:30 pm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="H:mm" id="time3" />
                      <Label htmlFor="time3">15:30</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-gray-500 mt-2">Попередній перегляд: {timePreview}</p>
                </div>

                <div>
                  <Label htmlFor="week_starts_on">Тиждень починається з</Label>
                  <Select
                    value={settings.week_starts_on}
                    onValueChange={(value) => setSettings({ ...settings, week_starts_on: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Виберіть день" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Понеділок</SelectItem>
                      <SelectItem value="sunday">Неділя</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" className="admin-button admin-button-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження...
              </>
            ) : (
              "Зберегти зміни"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

