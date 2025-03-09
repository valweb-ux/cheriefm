"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, Facebook, Instagram, Twitter, Youtube, Music } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SiteSettings } from "@/types/settings.types"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"

interface SocialSettingsProps {
  settings: SiteSettings
}

export function SocialSettings({ settings }: SocialSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    social_facebook: settings.social_links?.facebook || "",
    social_instagram: settings.social_links?.instagram || "",
    social_twitter: settings.social_links?.twitter || "",
    social_youtube: settings.social_links?.youtube || "",
    social_spotify: settings.social_links?.spotify || "",
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

      // Додаємо дані соціальних мереж
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
            <Label htmlFor="social_facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Label>
            <Input
              id="social_facebook"
              value={formData.social_facebook}
              onChange={(e) => handleChange("social_facebook", e.target.value)}
              placeholder="https://facebook.com/cheriefm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_instagram" className="flex items-center">
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </Label>
            <Input
              id="social_instagram"
              value={formData.social_instagram}
              onChange={(e) => handleChange("social_instagram", e.target.value)}
              placeholder="https://instagram.com/cheriefm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_twitter" className="flex items-center">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Label>
            <Input
              id="social_twitter"
              value={formData.social_twitter}
              onChange={(e) => handleChange("social_twitter", e.target.value)}
              placeholder="https://twitter.com/cheriefm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_youtube" className="flex items-center">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </Label>
            <Input
              id="social_youtube"
              value={formData.social_youtube}
              onChange={(e) => handleChange("social_youtube", e.target.value)}
              placeholder="https://youtube.com/cheriefm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_spotify" className="flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Spotify
            </Label>
            <Input
              id="social_spotify"
              value={formData.social_spotify}
              onChange={(e) => handleChange("social_spotify", e.target.value)}
              placeholder="https://open.spotify.com/user/cheriefm"
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

