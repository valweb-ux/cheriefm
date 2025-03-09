"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SeoSettings } from "@/types/analytics.types"
import { updateSeoSettingsAction } from "@/app/admin/analytics/actions"

interface SeoSettingsFormProps {
  settings: SeoSettings
  activeTab: "general" | "social" | "advanced"
}

export function SeoSettingsForm({ settings, activeTab }: SeoSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    site_title_template: settings.site_title_template || "%s | Chérie FM",
    site_description: settings.site_description || "",
    default_og_image: settings.default_og_image || "",
    twitter_handle: settings.twitter_handle || "",
    twitter_card_type: settings.twitter_card_type || "summary",
    facebook_app_id: settings.facebook_app_id || "",
    enable_sitemap: settings.enable_sitemap,
    enable_robots_txt: settings.enable_robots_txt,
    enable_structured_data: settings.enable_structured_data,
    enable_canonical_urls: settings.enable_canonical_urls,
    google_site_verification: settings.google_site_verification || "",
    bing_site_verification: settings.bing_site_verification || "",
    yandex_verification: settings.yandex_verification || "",
    custom_meta_tags: settings.custom_meta_tags ? JSON.stringify(settings.custom_meta_tags, null, 2) : "{}",
  })

  const handleChange = (field: string, value: string | boolean) => {
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

      // Додаємо всі поля до FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "true" : "false")
        } else {
          formDataObj.append(key, value as string)
        }
      })

      const result = await updateSeoSettingsAction(formDataObj)

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
      console.error("Error updating SEO settings:", error)
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
      {activeTab === "general" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title_template">Шаблон заголовка сайту</Label>
              <Input
                id="site_title_template"
                value={formData.site_title_template}
                onChange={(e) => handleChange("site_title_template", e.target.value)}
                placeholder="%s | Chérie FM"
              />
              <p className="text-xs text-muted-foreground">Використовуйте %s для підстановки назви сторінки</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Опис сайту</Label>
              <Textarea
                id="site_description"
                value={formData.site_description}
                onChange={(e) => handleChange("site_description", e.target.value)}
                placeholder="Опис сайту для пошукових систем"
              />
              <p className="text-xs text-muted-foreground">Рекомендована довжина: 150-160 символів</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_og_image">URL зображення за замовчуванням</Label>
              <Input
                id="default_og_image"
                value={formData.default_og_image}
                onChange={(e) => handleChange("default_og_image", e.target.value)}
                placeholder="https://cheriefm.ua/images/og-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Зображення, яке буде використовуватися для соціальних мереж, якщо не вказано інше
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "social" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter_handle">Twitter акаунт</Label>
              <Input
                id="twitter_handle"
                value={formData.twitter_handle}
                onChange={(e) => handleChange("twitter_handle", e.target.value)}
                placeholder="@cheriefm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_card_type">Тип Twitter карточки</Label>
              <Select
                value={formData.twitter_card_type}
                onValueChange={(value) => handleChange("twitter_card_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть тип карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Звичайна</SelectItem>
                  <SelectItem value="summary_large_image">Велике зображення</SelectItem>
                  <SelectItem value="app">Додаток</SelectItem>
                  <SelectItem value="player">Програвач</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_app_id">Facebook App ID</Label>
              <Input
                id="facebook_app_id"
                value={formData.facebook_app_id}
                onChange={(e) => handleChange("facebook_app_id", e.target.value)}
                placeholder="123456789012345"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "advanced" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_sitemap">Карта сайту (sitemap.xml)</Label>
                <p className="text-xs text-muted-foreground">Автоматично генерувати карту сайту</p>
              </div>
              <Switch
                id="enable_sitemap"
                checked={formData.enable_sitemap}
                onCheckedChange={(value) => handleChange("enable_sitemap", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_robots_txt">Файл robots.txt</Label>
                <p className="text-xs text-muted-foreground">Автоматично генерувати файл robots.txt</p>
              </div>
              <Switch
                id="enable_robots_txt"
                checked={formData.enable_robots_txt}
                onCheckedChange={(value) => handleChange("enable_robots_txt", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_structured_data">Структуровані дані</Label>
                <p className="text-xs text-muted-foreground">Додавати структуровані дані JSON-LD</p>
              </div>
              <Switch
                id="enable_structured_data"
                checked={formData.enable_structured_data}
                onCheckedChange={(value) => handleChange("enable_structured_data", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_canonical_urls">Канонічні URL</Label>
                <p className="text-xs text-muted-foreground">Додавати канонічні URL для всіх сторінок</p>
              </div>
              <Switch
                id="enable_canonical_urls"
                checked={formData.enable_canonical_urls}
                onCheckedChange={(value) => handleChange("enable_canonical_urls", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_site_verification">Google Site Verification</Label>
              <Input
                id="google_site_verification"
                value={formData.google_site_verification}
                onChange={(e) => handleChange("google_site_verification", e.target.value)}
                placeholder="Код верифікації Google"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bing_site_verification">Bing Site Verification</Label>
              <Input
                id="bing_site_verification"
                value={formData.bing_site_verification}
                onChange={(e) => handleChange("bing_site_verification", e.target.value)}
                placeholder="Код верифікації Bing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yandex_verification">Yandex Verification</Label>
              <Input
                id="yandex_verification"
                value={formData.yandex_verification}
                onChange={(e) => handleChange("yandex_verification", e.target.value)}
                placeholder="Код верифікації Yandex"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_meta_tags">Додаткові мета-теги (JSON)</Label>
              <Textarea
                id="custom_meta_tags"
                value={formData.custom_meta_tags}
                onChange={(e) => handleChange("custom_meta_tags", e.target.value)}
                placeholder='{"keywords": "радіо, музика, новини"}'
                rows={5}
              />
              <p className="text-xs text-muted-foreground">Формат: &#123;"name": "content"&#125;</p>
            </div>
          </CardContent>
        </Card>
      )}

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

