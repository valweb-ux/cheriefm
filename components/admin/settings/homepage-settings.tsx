"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/admin/media/media-picker"
import type { HomepageSettings as HomepageSettingsType } from "@/types/settings.types"
import { updateHomepageSettingsAction } from "@/app/admin/settings/actions"

interface HomepageSettingsProps {
  settings: HomepageSettingsType
}

export function HomepageSettings({ settings }: HomepageSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    // Hero section
    hero_title: settings.hero_title || "",
    hero_subtitle: settings.hero_subtitle || "",
    hero_image_url: settings.hero_image_url || "",
    hero_cta_text: settings.hero_cta_text || "",
    hero_cta_link: settings.hero_cta_link || "",

    // Featured programs
    featured_programs_enabled: settings.featured_programs_enabled,
    featured_programs_title: settings.featured_programs_title || "",
    featured_programs_count: settings.featured_programs_count || 3,

    // Featured news
    featured_news_enabled: settings.featured_news_enabled,
    featured_news_title: settings.featured_news_title || "",
    featured_news_count: settings.featured_news_count || 3,

    // Featured music
    featured_music_enabled: settings.featured_music_enabled,
    featured_music_title: settings.featured_music_title || "",
    featured_music_count: settings.featured_music_count || 6,

    // About section
    about_section_enabled: settings.about_section_enabled,
    about_section_title: settings.about_section_title || "",
    about_section_content: settings.about_section_content || "",
    about_section_image_url: settings.about_section_image_url || "",

    // Schedule section
    schedule_section_enabled: settings.schedule_section_enabled,
    schedule_section_title: settings.schedule_section_title || "",

    // Contact section
    contact_section_enabled: settings.contact_section_enabled,
    contact_section_title: settings.contact_section_title || "",
    contact_section_content: settings.contact_section_content || "",
  })

  const handleChange = (field: string, value: string | boolean | number) => {
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

      // Додаємо всі дані
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "on" : "off")
        } else {
          formDataObj.append(key, String(value))
        }
      })

      const result = await updateHomepageSettingsAction(formDataObj)

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
      console.error("Error updating homepage settings:", error)
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
      <Tabs defaultValue="hero">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Головний банер</TabsTrigger>
          <TabsTrigger value="featured">Рекомендовані</TabsTrigger>
          <TabsTrigger value="about">Про нас</TabsTrigger>
          <TabsTrigger value="schedule">Розклад</TabsTrigger>
          <TabsTrigger value="contact">Контакти</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Головний банер</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Заголовок</Label>
                <Input
                  id="hero_title"
                  value={formData.hero_title}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  placeholder="Шері ФМ - Ваше улюблене радіо"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Підзаголовок</Label>
                <Input
                  id="hero_subtitle"
                  value={formData.hero_subtitle}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  placeholder="Слухайте найкращу музику та програми"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_image_url">Зображення</Label>
                <MediaPicker value={formData.hero_image_url} onSelect={(url) => handleChange("hero_image_url", url)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_cta_text">Текст кнопки</Label>
                  <Input
                    id="hero_cta_text"
                    value={formData.hero_cta_text}
                    onChange={(e) => handleChange("hero_cta_text", e.target.value)}
                    placeholder="Слухати зараз"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_cta_link">Посилання кнопки</Label>
                  <Input
                    id="hero_cta_link"
                    value={formData.hero_cta_link}
                    onChange={(e) => handleChange("hero_cta_link", e.target.value)}
                    placeholder="/listen"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Рекомендовані програми</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_programs_enabled"
                    checked={formData.featured_programs_enabled}
                    onCheckedChange={(checked) => handleChange("featured_programs_enabled", checked)}
                  />
                  <Label htmlFor="featured_programs_enabled">Показувати рекомендовані програми</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_programs_title">Заголовок секції</Label>
                  <Input
                    id="featured_programs_title"
                    value={formData.featured_programs_title}
                    onChange={(e) => handleChange("featured_programs_title", e.target.value)}
                    placeholder="Популярні програми"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_programs_count">Кількість програм</Label>
                  <Input
                    id="featured_programs_count"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.featured_programs_count}
                    onChange={(e) => handleChange("featured_programs_count", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рекомендовані новини</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_news_enabled"
                    checked={formData.featured_news_enabled}
                    onCheckedChange={(checked) => handleChange("featured_news_enabled", checked)}
                  />
                  <Label htmlFor="featured_news_enabled">Показувати рекомендовані новини</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_news_title">Заголовок секції</Label>
                  <Input
                    id="featured_news_title"
                    value={formData.featured_news_title}
                    onChange={(e) => handleChange("featured_news_title", e.target.value)}
                    placeholder="Останні новини"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_news_count">Кількість новин</Label>
                  <Input
                    id="featured_news_count"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.featured_news_count}
                    onChange={(e) => handleChange("featured_news_count", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рекомендована музика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_music_enabled"
                    checked={formData.featured_music_enabled}
                    onCheckedChange={(checked) => handleChange("featured_music_enabled", checked)}
                  />
                  <Label htmlFor="featured_music_enabled">Показувати рекомендовану музику</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_music_title">Заголовок секції</Label>
                  <Input
                    id="featured_music_title"
                    value={formData.featured_music_title}
                    onChange={(e) => handleChange("featured_music_title", e.target.value)}
                    placeholder="Популярні треки"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_music_count">Кількість треків</Label>
                  <Input
                    id="featured_music_count"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.featured_music_count}
                    onChange={(e) => handleChange("featured_music_count", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Секція "Про нас"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="about_section_enabled"
                  checked={formData.about_section_enabled}
                  onCheckedChange={(checked) => handleChange("about_section_enabled", checked)}
                />
                <Label htmlFor="about_section_enabled">Показувати секцію "Про нас"</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_section_title">Заголовок секції</Label>
                <Input
                  id="about_section_title"
                  value={formData.about_section_title}
                  onChange={(e) => handleChange("about_section_title", e.target.value)}
                  placeholder="Про Шері ФМ"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_section_content">Вміст секції</Label>
                <Textarea
                  id="about_section_content"
                  value={formData.about_section_content}
                  onChange={(e) => handleChange("about_section_content", e.target.value)}
                  placeholder="Шері ФМ - це радіостанція, яка..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_section_image_url">Зображення</Label>
                <MediaPicker
                  value={formData.about_section_image_url}
                  onSelect={(url) => handleChange("about_section_image_url", url)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Секція "Розклад ефіру"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="schedule_section_enabled"
                  checked={formData.schedule_section_enabled}
                  onCheckedChange={(checked) => handleChange("schedule_section_enabled", checked)}
                />
                <Label htmlFor="schedule_section_enabled">Показувати секцію "Розклад ефіру"</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule_section_title">Заголовок секції</Label>
                <Input
                  id="schedule_section_title"
                  value={formData.schedule_section_title}
                  onChange={(e) => handleChange("schedule_section_title", e.target.value)}
                  placeholder="Розклад ефіру"
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Розклад ефіру буде автоматично сформовано на основі активних програм.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Секція "Контакти"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="contact_section_enabled"
                  checked={formData.contact_section_enabled}
                  onCheckedChange={(checked) => handleChange("contact_section_enabled", checked)}
                />
                <Label htmlFor="contact_section_enabled">Показувати секцію "Контакти"</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_section_title">Заголовок секції</Label>
                <Input
                  id="contact_section_title"
                  value={formData.contact_section_title}
                  onChange={(e) => handleChange("contact_section_title", e.target.value)}
                  placeholder="Зв'яжіться з нами"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_section_content">Вміст секції</Label>
                <Textarea
                  id="contact_section_content"
                  value={formData.contact_section_content}
                  onChange={(e) => handleChange("contact_section_content", e.target.value)}
                  placeholder="Маєте питання або пропозиції? Зв'яжіться з нами..."
                  rows={5}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Контактна інформація буде автоматично додана з загальних налаштувань сайту.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="mt-6" disabled={saving}>
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

