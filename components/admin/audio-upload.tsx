"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { FileAudioIcon, Loader2Icon, UploadIcon, XIcon, PlayIcon, PauseIcon } from "lucide-react"

export function AudioUpload({
  value,
  onChange,
  bucketName = "audio",
}: {
  value: string
  onChange: (value: string, duration?: number) => void
  bucketName?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Перевірка типу файлу
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Помилка",
        description: "Будь ласка, завантажте аудіо файл",
        variant: "destructive",
      })
      return
    }

    // Перевірка розміру файлу (макс. 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Помилка",
        description: "Розмір файлу не повинен перевищувати 20MB",
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

      // Отримуємо тривалість аудіо
      const audioDuration = await getAudioDuration(file)
      setDuration(audioDuration)

      onChange(data.publicUrl, audioDuration)
      toast({
        title: "Успішно",
        description: "Аудіо файл завантажено",
      })
    } catch (error) {
      console.error("Error uploading audio:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити аудіо файл",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration))
      }
      audio.src = URL.createObjectURL(file)
    })
  }

  const handleRemove = () => {
    onChange("")
    setDuration(null)
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {value && (
        <audio
          ref={audioRef}
          src={value}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => {
            if (!duration) {
              const audioDuration = Math.round((e.target as HTMLAudioElement).duration)
              setDuration(audioDuration)
              onChange(value, audioDuration)
            }
          }}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-md border">
          {value ? (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlay}>
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
              </Button>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <FileAudioIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {value ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground break-all">{value.split("/").pop()}</p>
              <p className="text-sm text-muted-foreground">Тривалість: {formatDuration(duration)}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
                  <XIcon className="mr-2 h-4 w-4" />
                  Видалити
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Рекомендовані формати: MP3, WAV, OGG</p>
              <p className="text-sm text-muted-foreground">Максимальний розмір: 20MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
          id="audio-upload"
        />
        <label htmlFor="audio-upload" className="w-full">
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
                  {value ? "Замінити аудіо" : "Завантажити аудіо"}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
}

