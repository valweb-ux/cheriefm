"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"
import type { SiteSettings } from "@/types/settings.types"

interface GeneralSettingsFormProps {
  settings: SiteSettings
}

export function GeneralSettingsForm({ settings }: GeneralSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Назва сайту</Label>
                  <Input id="site_name" name="site_name" defaultValue={settings.site_name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_language">Мова за замовчуванням</Label>
                  <Select defaultValue={settings.default_language} name="default_language">
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="site_description">Опис сайту</Label>
                  <Textarea
                    id="site_description"
                    name="site_description"
                    defaultValue={settings.site_description || ""}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Логотип</Label>
                  <MediaPicker
                    value={settings.logo_url || ""}
                    onSelect={(url) => {
                      const input = document.querySelector('input[name="logo_url"]') as HTMLInputElement
                      if (input) input.value = url
                    }}
                  />
                  <Input type="hidden" name="logo_url" defaultValue={settings.logo_url || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon_url">Фавікон</Label>
                  <MediaPicker
                    value={settings.favicon_url || ""}
                    onSelect={(url) => {
                      const input = document.querySelector('input[name="favicon_url"]') as HTMLInputElement
                      if (input) input.value = url
                    }}
                  />
                  <Input type="hidden" name="favicon_url" defaultValue={settings.favicon_url || ""} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="footer_text">Текст футера</Label>
                  <Input id="footer_text" name="footer_text" defaultValue={settings.footer_text || ""} />
                </div>

                <div className="space-y-2">
                  <Label>Доступні мови</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lang_uk"
                        name="available_languages"
                        value="uk"
                        defaultChecked={settings.available_languages.includes("uk")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="lang_uk" className="font-normal">
                        Українська
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lang_fr"
                        name="available_languages"
                        value="fr"
                        defaultChecked={settings.available_languages.includes("fr")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="lang_fr" className="font-normal">
                        Французька
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lang_en"
                        name="available_languages"
                        value="en"
                        defaultChecked={settings.available_languages.includes("en")}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="lang_en" className="font-normal">
                        Англійська
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analytics_id">ID Google Analytics</Label>
                  <Input
                    id="analytics_id"
                    name="analytics_id"
                    defaultValue={settings.analytics_id || ""}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Контактна інформація</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    defaultValue={settings.contact_email || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Телефон</Label>
                  <Input id="contact_phone" name="contact_phone" defaultValue={settings.contact_phone || ""} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Адреса</Label>
                  <Textarea id="address" name="address" defaultValue={settings.address || ""} rows={2} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Соціальні мережі</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    name="social_facebook"
                    defaultValue={settings.social_links?.facebook || ""}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    name="social_instagram"
                    defaultValue={settings.social_links?.instagram || ""}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    name="social_twitter"
                    defaultValue={settings.social_links?.twitter || ""}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    name="social_youtube"
                    defaultValue={settings.social_links?.youtube || ""}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_spotify">Spotify</Label>
                  <Input
                    id="social_spotify"
                    name="social_spotify"
                    defaultValue={settings.social_links?.spotify || ""}
                    placeholder="https://open.spotify.com/user/yourprofile"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Стрімінг</h3>

              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="streaming_enabled" name="streaming_enabled" defaultChecked={settings.streaming_enabled} />
                  <Label htmlFor="streaming_enabled">Увімкнути стрімінг</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streaming_url">URL стрімінгу</Label>
                  <Input
                    id="streaming_url"
                    name="streaming_url"
                    defaultValue={settings.streaming_url || ""}
                    placeholder="https://stream.example.com/live"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Розширені налаштування</h3>

              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance_mode" name="maintenance_mode" defaultChecked={settings.maintenance_mode} />
                  <Label htmlFor="maintenance_mode">Режим обслуговування</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance_message">Повідомлення про обслуговування</Label>
                  <Textarea
                    id="maintenance_message"
                    name="maintenance_message"
                    defaultValue={settings.maintenance_message || ""}
                    rows={3}
                    placeholder="Сайт на технічному обслуговуванні. Будь ласка, спробуйте пізніше."
                  />
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

