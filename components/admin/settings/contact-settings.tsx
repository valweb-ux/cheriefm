"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SiteSettings } from "@/types/settings.types"
import { updateSiteSettingsAction } from "@/app/admin/settings/actions"

interface ContactSettingsProps {
  settings: SiteSettings
}

export function ContactSettings({ settings }: ContactSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    contact_email: settings.contact_email || "",
    contact_phone: settings.contact_phone || "",
    address: settings.address || "",
    footer_text: settings.footer_text || "",
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

      // Додаємо контактні дані
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
            <Label htmlFor="contact_email">Email для зв'язку</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange("contact_email", e.target.value)}
              placeholder="contact@cheriefm.ua"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Телефон</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              placeholder="+380 XX XXX XX XX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адреса</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Київ, вул. Хрещатик, 1"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_text">Текст у футері</Label>
            <Textarea
              id="footer_text"
              value={formData.footer_text}
              onChange={(e) => handleChange("footer_text", e.target.value)}
              placeholder="© 2023 Шері ФМ. Всі права захищені."
              rows={3}
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

