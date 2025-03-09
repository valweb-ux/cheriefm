"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { ImageIcon, Loader2Icon, UploadIcon, XIcon } from "lucide-react"

export function ImageUpload({
  value,
  onChange,
  bucketName = "images",
}: {
  value: string
  onChange: (value: string) => void
  bucketName?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Перевірка типу файлу
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Помилка",
        description: "Будь ласка, завантажте зображення",
        variant: "destructive",
      })
      return
    }

    // Перевірка розміру файлу (макс. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Помилка",
        description: "Розмір файлу не повинен перевищувати 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Генеруємо унікальне ім'я файлу
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${bucketName}/${fileName}`

      // Завантажуємо файл
      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Отримуємо публічне URL
      const { data } = supabase.storage.from("public").getPublicUrl(filePath)

      onChange(data.publicUrl)
      toast({
        title: "Успішно",
        description: "Зображення завантажено",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити зображення",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex h-40 w-40 shrink-0 overflow-hidden rounded-md border">
          {value ? (
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {value ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground break-all">{value.split("/").pop()}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
                  <XIcon className="mr-2 h-4 w-4" />
                  Видалити
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Рекомендовані формати: JPG, PNG, WebP</p>
              <p className="text-sm text-muted-foreground">Максимальний розмір: 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="w-full">
          <Button type="button" variant="outline" className="w-full cursor-pointer" disabled={isUploading} asChild>
            <span>
              {isUploading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Завантаження...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {value ? "Замінити зображення" : "Завантажити зображення"}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
}

