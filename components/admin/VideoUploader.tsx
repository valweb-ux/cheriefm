"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, Video } from "lucide-react"
import { useRouter } from "next/navigation"

export function VideoUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Перевірка, чи це відеофайл
    if (!file.type.startsWith("video/")) {
      setError("Будь ласка, виберіть відеофайл")
      return
    }

    // Перевірка розміру файлу (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError(
        `Файл занадто великий. Максимальний розмір: 100MB. Поточний розмір: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      )
      return
    }

    setVideoFile(file)
    setError(null)

    // Створюємо URL для попереднього перегляду відео
    const objectUrl = URL.createObjectURL(file)
    setVideoPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleUpload = async () => {
    if (!videoFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Створюємо FormData для завантаження файлу
      const formData = new FormData()
      formData.append("file", videoFile)

      // Імітуємо прогрес завантаження
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10
          return prev
        })
      }, 500)

      // Завантажуємо файл через API
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      // Спочатку отримуємо текст відповіді
      const responseText = await response.text()
      console.log(`Відповідь сервера: ${responseText.substring(0, 200)}${responseText.length > 200 ? "..." : ""}`)

      let data
      try {
        // Потім намагаємося розібрати його як JSON
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Помилка парсингу JSON:", parseError)
        throw new Error(`Помилка при завантаженні відеофайлу. Можливі причини: 
        1. Файл занадто великий (рекомендовано до 100MB)
        2. Формат відео не підтримується (рекомендовано MP4 або WebM)
        3. Проблема з кодеком відео
        
        Технічні деталі: Сервер повернув невалідний JSON. Відповідь: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося завантажити відеофайл")
      }

      // Встановлюємо прогрес 100% після успішного завантаження
      setUploadProgress(100)

      // Перенаправляємо на сторінку медіа-бібліотеки після успішного завантаження
      setTimeout(() => {
        router.push("/admin/media")
      }, 1000)
    } catch (error) {
      console.error("Помилка завантаження відео:", error)
      setError(error instanceof Error ? error.message : "Не вдалося завантажити відеофайл")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Завантаження відео</h2>
      <p className="text-sm text-gray-500 mb-6">
        Спеціальний завантажувач для відеофайлів. Рекомендовані формати: MP4, WebM. Максимальний розмір: 100MB.
      </p>

      <div className="space-y-6">
        {videoPreview ? (
          <div className="border rounded-lg overflow-hidden">
            <video
              src={videoPreview}
              controls
              className="w-full h-auto max-h-[300px]"
              onError={() => setError("Не вдалося відтворити відео. Можливо, формат не підтримується браузером.")}
            />
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Натисніть, щоб вибрати відеофайл</p>
            <p className="mt-1 text-xs text-gray-400">MP4, WebM, до 100MB</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">{uploadProgress}% завантажено</p>
          </div>
        )}

        <div className="flex space-x-3">
          {videoFile && !isUploading && (
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Завантажити відео
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={videoFile ? "w-1/2" : "w-full"}
          >
            {videoFile ? "Вибрати інше відео" : "Вибрати відео"}
          </Button>
        </div>
      </div>
    </div>
  )
}

