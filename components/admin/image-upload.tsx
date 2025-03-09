"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, UploadIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  accept?: string
  maxSize?: number
}

export default function ImageUpload({
  value,
  onChange,
  label = "Зображення",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      setError(`Файл занадто великий. Максимальний розмір: ${maxSize / 1024 / 1024}MB`)
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {preview ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => {
                  setPreview(null)
                  onChange("")
                }}
              >
                Видалити
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">Перетягніть зображення сюди або натисніть для вибору</p>
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <UploadIcon className="h-4 w-4" />
                Вибрати зображення
              </Label>
            </div>
          )}
          <Input id="image-upload" type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </CardContent>
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

