"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/use-toast"
import { uploadMediaFile } from "@/lib/supabase/media-api"

export function MediaUpload() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isUploading, setIsUploading] = useState(false)
  const [altText, setAltText] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  const currentFolder = searchParams.get("folder") || undefined

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const file = files[0]

      await uploadMediaFile(file, {
        alt_text: altText,
        description,
        is_public: isPublic,
        folder_id: currentFolder,
      })

      toast({
        title: "Успішно",
        description: "Файл завантажено",
      })

      // Скидаємо форму
      setAltText("")
      setDescription("")

      // Перенаправляємо на сторінку бібліотеки
      router.push(`/admin/media${currentFolder ? `?folder=${currentFolder}` : ""}`)
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося завантажити файл",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Завантажити файл</Label>
              <FileUpload
                onUpload={handleUpload}
                isUploading={isUploading}
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                  "application/pdf": [".pdf"],
                  "audio/*": [".mp3", ".wav"],
                  "video/*": [".mp4", ".webm"],
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt-text">Альтернативний текст (для зображень)</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Опис зображення для людей з вадами зору"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Опис</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Додатковий опис файлу"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="is-public">Публічний доступ</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

