"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/admin/media/media-picker"
import type { SiteSettings } from "@/types/settings.types"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"

interface GeneralSettingsProps {
  settings: SiteSettings
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_name: settings.site_name,
    site_description: settings.site_description || "",
    logo_url: settings.logo_url || "",
    favicon_url: settings.favicon_url || "",
    primary_color: settings.primary_color || "#ff4081",
    secondary_color: settings.secondary_color || "#3f51b5",
    default_language: settings.default_language || "uk",
    available_languages: settings.available_languages.join(", "),
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const result = await updateSiteSettingsAction(formDataObj)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
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
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Назва сайту</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => handleChange("site_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Опис сайту</Label>
            <Input
              id="site_description"
              value={formData.site_description}
              onChange={(e) => handleChange("site_description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Логотип</Label>
            <MediaPicker value={formData.logo_url} onSelect={(url) => handleChange("logo_url", url)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon_url">Favicon</Label>
            <MediaPicker value={formData.favicon_url} onSelect={(url) => handleChange("favicon_url", url)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Основний колір</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Додатковий колір</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => handleChange("secondary_color", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => handleChange("secondary_color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_language">Мова за замовчуванням</Label>
            <Select
              value={formData.default_language}
              onValueChange={(value) => handleChange("default_language", value)}
            >
              <SelectTrigger id="default_language">
                <SelectValue placeholder="Виберіть мову" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">Українська</SelectItem>
                <SelectItem value="fr">Французька</SelectItem>
                <SelectItem value="en">Англійська</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_languages">Доступні мови (через кому)</Label>
            <Input
              id="available_languages"
              value={formData.available_languages}
              onChange={(e) => handleChange("available_languages", e.target.value)}
              placeholder="uk, fr, en"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="mt-4" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Збереження...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Зберегти
          </>
        )}
      </Button>
    </form>
  )
}

