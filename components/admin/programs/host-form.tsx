"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/admin/media/media-picker"

interface HostFormProps {
  id?: string
}

interface HostData {
  name: string
  bio: string
  photo: string
  email: string
  phone: string
  social_media: {
    instagram: string
    twitter: string
    facebook: string
    linkedin: string
  }
  is_active: boolean
}

export function HostForm({ id }: HostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<HostData>({
    name: "",
    bio: "",
    photo: "",
    email: "",
    phone: "",
    social_media: {
      instagram: "",
      twitter: "",
      facebook: "",
      linkedin: "",
    },
    is_active: true,
  })

  // Завантажуємо дані ведучого, якщо це редагування
  useEffect(() => {
    if (id) {
      const fetchHostData = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/admin/hosts/${id}`)

          if (!response.ok) {
            throw new Error(`Помилка завантаження: ${response.status}`)
          }

          const hostData = await response.json()

          // Форматуємо дані для форми
          setFormData({
            name: hostData.name,
            bio: hostData.bio || "",
            photo: hostData.photo || "",
            email: hostData.email || "",
            phone: hostData.phone || "",
            social_media: {
              instagram: hostData.social_media?.instagram || "",
              twitter: hostData.social_media?.twitter || "",
              facebook: hostData.social_media?.facebook || "",
              linkedin: hostData.social_media?.linkedin || "",
            },
            is_active: hostData.is_active,
          })
        } catch (error) {
          console.error("Помилка при завантаженні ведучого:", error)
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити дані ведучого",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchHostData()
    }
  }, [id])

  const handleChange = (field: keyof HostData | string, value: string | boolean) => {
    // Обробка соціальних мереж
    if (field.startsWith("social_media.")) {
      const socialField = field.split(".")[1] as keyof typeof formData.social_media
      setFormData((prev) => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [socialField]: value,
        },
      }))
    } else {
      // Обробка інших полів
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Перевіряємо обов'язкові поля
      if (!formData.name) {
        throw new Error("Ім'я ведучого є обов'язковим")
      }

      // Створюємо FormData для відправки
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("bio", formData.bio)
      submitData.append("photo", formData.photo)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("instagram", formData.social_media.instagram)
      submitData.append("twitter", formData.social_media.twitter)
      submitData.append("facebook", formData.social_media.facebook)
      submitData.append("linkedin", formData.social_media.linkedin)
      submitData.append("is_active", formData.is_active ? "on" : "off")

      // Відправляємо дані
      let response
      if (id) {
        // Оновлюємо існуючого ведучого
        response = await fetch(`/api/admin/hosts/${id}`, {
          method: "PUT",
          body: submitData,
        })
      } else {
        // Створюємо нового ведучого
        response = await fetch("/api/admin/hosts", {
          method: "POST",
          body: submitData,
        })
      }

      if (!response.ok) {
        throw new Error(`Помилка збереження: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: id ? "Ведучого оновлено" : "Ведучого створено",
        })
        router.push("/admin/hosts")
      } else {
        throw new Error(result.message || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні ведучого:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти ведучого",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ім'я ведучого</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Біографія</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Фото</Label>
                  <MediaPicker value={formData.photo} onSelect={(url) => handleChange("photo", url)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+380XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_media.instagram}
                  onChange={(e) => handleChange("social_media.instagram", e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social_media.twitter}
                  onChange={(e) => handleChange("social_media.twitter", e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_media.facebook}
                  onChange={(e) => handleChange("social_media.facebook", e.target.value)}
                  placeholder="username або URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social_media.linkedin}
                  onChange={(e) => handleChange("social_media.linkedin", e.target.value)}
                  placeholder="username або URL"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Активний ведучий</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/hosts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до списку
          </Button>

          <Button type="submit" disabled={saving}>
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
        </div>
      </div>
    </form>
  )
}

