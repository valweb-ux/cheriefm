"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SiteSettings } from "@/types/settings.types"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"

interface SeoSettingsProps {
  settings: SiteSettings
}

export function SeoSettings({ settings }: SeoSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_description: settings.site_description || "",
    meta_keywords: settings.meta_keywords || "",
    analytics_id: settings.analytics_id || "",
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

      // Додаємо поточні дані
      formDataObj.append("site_name", settings.site_name)
      formDataObj.append("default_language", settings.default_language)
      formDataObj.append("available_languages", settings.available_languages.join(", "))

      // Додаємо SEO дані
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
            <Label htmlFor="site_description">Мета-опис сайту</Label>
            <Textarea
              id="site_description"
              value={formData.site_description}
              onChange={(e) => handleChange("site_description", e.target.value)}
              placeholder="Короткий опис сайту для пошукових систем"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Рекомендована довжина: 150-160 символів</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Ключові слова</Label>
            <Textarea
              id="meta_keywords"
              value={formData.meta_keywords}
              onChange={(e) => handleChange("meta_keywords", e.target.value)}
              placeholder="радіо, музика, шері, фм, новини, програми"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Розділяйте ключові слова комами</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analytics_id">Google Analytics ID</Label>
            <Input
              id="analytics_id"
              value={formData.analytics_id}
              onChange={(e) => handleChange("analytics_id", e.target.value)}
              placeholder="G-XXXXXXXXXX або UA-XXXXXXXX-X"
            />
            <p className="text-xs text-muted-foreground">Ідентифікатор відстеження Google Analytics</p>
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

