"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageEditor } from "@/components/ui/image-editor"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react"
import { updateMediaFile, deleteMediaFile } from "@/lib/supabase/media-api"
import type { MediaFileWithUrl } from "@/lib/supabase/schema"

interface MediaDetailsProps {
  media: MediaFileWithUrl
}

export function MediaDetails({ media }: MediaDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(media.name)
  const [altText, setAltText] = useState(media.alt_text || "")
  const [description, setDescription] = useState(media.description || "")
  const [isPublic, setIsPublic] = useState(media.is_public)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isImage = media.file_type.startsWith("image/")

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateMediaFile(media.id, {
        name,
        alt_text: altText,
        description,
        is_public: isPublic,
      })

      toast({
        title: "Успішно",
        description: "Зміни збережено",
      })
    } catch (error) {
      console.error("Error updating media:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти зміни",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Ви впевнені, що хочете видалити цей файл?")) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteMediaFile(media.id)

      toast({
        title: "Успішно",
        description: "Файл видалено",
      })

      // Перенаправляємо на сторінку бібліотеки
      router.push("/admin/media")
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося видалити файл",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveEditedImage = async (blob: Blob) => {
    // Тут можна реалізувати збереження відредагованого зображення
    // Наприклад, завантажити його як нову версію
    toast({
      title: "Інформація",
      description: "Функція збереження відредагованого зображення в розробці",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push("/admin/media")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад до бібліотеки
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            {isImage ? (
              <div className="space-y-4">
                <img
                  src={media.url || "/placeholder.svg"}
                  alt={media.alt_text || media.name}
                  className="w-full h-auto rounded-md"
                />

                <div className="text-sm text-muted-foreground">
                  <p>
                    Розміри: {media.width} × {media.height} пікселів
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-md">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-lg font-medium">{media.name}</p>
                <p className="text-sm text-muted-foreground">{media.file_type}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Деталі</TabsTrigger>
                  {isImage && <TabsTrigger value="edit">Редагувати</TabsTrigger>}
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Назва файлу</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  {isImage && (
                    <div className="space-y-2">
                      <Label htmlFor="alt-text">Альтернативний текст</Label>
                      <Input
                        id="alt-text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Опис зображення для людей з вадами зору"
                      />
                    </div>
                  )}

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

                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-medium">Інформація про файл</h3>
                    <div className="text-sm">
                      <p>Тип: {media.file_type}</p>
                      <p>Розмір: {formatFileSize(media.file_size)}</p>
                      <p>Завантажено: {formatDate(media.created_at)}</p>
                      {media.updated_at !== media.created_at && <p>Оновлено: {formatDate(media.updated_at)}</p>}
                    </div>
                  </div>
                </TabsContent>

                {isImage && (
                  <TabsContent value="edit">
                    <ImageEditor imageUrl={media.url} onSave={handleSaveEditedImage} />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Видалення...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </>
              )}
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Збереження...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Зберегти
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

