"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, Video, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function DirectUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Перевірка розміру файлу (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(
        `Файл занадто великий. Максимальний розмір: 50MB. Поточний розмір: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`,
      )
      return
    }

    setFile(selectedFile)
    setError(null)
    setSuccess(null)

    // Створюємо URL для попереднього перегляду, якщо це відео або зображення
    if (selectedFile.type.startsWith("video/") || selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setFilePreview(objectUrl)
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    } else {
      setFilePreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      // Генеруємо унікальне ім'я файлу
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `media/${fileName}`

      console.log(`Початок прямого завантаження файлу: ${file.name}, розмір: ${file.size} байт, шлях: ${filePath}`)

      // Імітуємо прогрес завантаження
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 10
          return prev
        })
      }, 500)

      // Пряме завантаження до Supabase Storage
      const { data, error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      // Очищаємо інтервал після завершення завантаження
      clearInterval(progressInterval)

      if (uploadError) {
        console.error("Помилка при завантаженні файлу:", uploadError)

        // Спеціальна обробка для помилки перевищення розміру
        if (uploadError.message.includes("exceeded the maximum allowed size")) {
          throw new Error(`Файл перевищує максимально дозволений розмір на сервері. 
          Спробуйте зменшити розмір файлу або розділити його на менші частини.`)
        }

        throw new Error(`Помилка при завантаженні файлу: ${uploadError.message}`)
      }

      // Отримуємо публічний URL файлу
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

      console.log("Файл успішно завантажено, URL:", urlData.publicUrl)
      setSuccess(`Файл "${file.name}" успішно завантажено!`)

      // Перенаправляємо на сторінку медіа-бібліотеки після успішного завантаження
      setTimeout(() => {
        router.push("/admin/media")
      }, 2000)
    } catch (error) {
      console.error("Помилка завантаження:", error)
      setError(error instanceof Error ? error.message : "Не вдалося завантажити файл")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setFilePreview(null)
    setError(null)
    setSuccess(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Пряме завантаження файлів</h2>
      <p className="text-sm text-gray-500 mb-6">
        Цей метод дозволяє завантажувати файли розміром до 50MB безпосередньо до сховища, обходячи обмеження API.
      </p>

      <div className="space-y-6">
        {filePreview && file?.type.startsWith("video/") ? (
          <div className="border rounded-lg overflow-hidden">
            <video
              src={filePreview}
              controls
              className="w-full h-auto max-h-[300px]"
              onError={() => setError("Не вдалося відтворити відео. Можливо, формат не підтримується браузером.")}
            />
          </div>
        ) : filePreview && file?.type.startsWith("image/") ? (
          <div className="border rounded-lg overflow-hidden">
            <img
              src={filePreview || "/placeholder.svg"}
              alt="Попередній перегляд"
              className="w-full h-auto max-h-[300px] object-contain"
            />
          </div>
        ) : file ? (
          <div className="border rounded-lg p-4 flex items-center">
            <div className="bg-gray-100 p-3 rounded-full mr-3">
              <Video className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button onClick={handleCancel} className="ml-2 text-gray-400 hover:text-gray-600" title="Скасувати">
              <X size={20} />
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Натисніть, щоб вибрати файл</p>
            <p className="mt-1 text-xs text-gray-400">Зображення, відео, аудіо, PDF, до 50MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-700">{success}</p>
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
          {file && !isUploading && !success && (
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Завантажити файл
            </Button>
          )}

          {!isUploading && !success && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={file ? "w-1/2" : "w-full"}
            >
              {file ? "Вибрати інший файл" : "Вибрати файл"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

