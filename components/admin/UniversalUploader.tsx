"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, Video, ImageIcon, FileText, Music, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function UniversalUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Налаштування обробників подій для drag & drop
  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(true)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragActive) setIsDragActive(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Перевіряємо, чи курсор вийшов за межі dropZone
      if (e.target === dropZone) {
        setIsDragActive(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0])
      }
    }

    dropZone.addEventListener("dragenter", handleDragEnter)
    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    return () => {
      dropZone.removeEventListener("dragenter", handleDragEnter)
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [isDragActive])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    handleFileSelect(selectedFile)
  }

  const handleFileSelect = (selectedFile: File) => {
    // Перевірка розміру файлу (30MB)
    if (selectedFile.size > 30 * 1024 * 1024) {
      setError(
        `Файл занадто великий. Максимальний розмір: 30MB. Поточний розмір: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`,
      )
      return
    }

    // Перевірка типу файлу
    const isAllowedType =
      selectedFile.type.startsWith("image/") ||
      selectedFile.type.startsWith("audio/") ||
      selectedFile.type.startsWith("video/") ||
      selectedFile.type === "application/pdf"

    if (!isAllowedType) {
      setError(`Тип файлу ${selectedFile.type} не підтримується. Дозволені типи: зображення, аудіо, відео, PDF.`)
      return
    }

    setFile(selectedFile)
    setError(null)
    setSuccess(null)

    // Створюємо URL для попереднього перегляду
    if (selectedFile.type.startsWith("image/") || selectedFile.type.startsWith("video/")) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setFilePreview(objectUrl)
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    } else {
      setFilePreview(null)
    }
  }

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <FileText className="h-12 w-12 text-gray-400" />

    if (fileType.startsWith("image/")) return <ImageIcon className="h-12 w-12 text-blue-400" />
    if (fileType.startsWith("video/")) return <Video className="h-12 w-12 text-red-400" />
    if (fileType.startsWith("audio/")) return <Music className="h-12 w-12 text-green-400" />
    if (fileType === "application/pdf") return <FileText className="h-12 w-12 text-orange-400" />

    return <FileText className="h-12 w-12 text-gray-400" />
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

      console.log(`Початок завантаження файлу: ${file.name}, розмір: ${file.size} байт, шлях: ${filePath}`)

      // Імітуємо прогрес завантаження
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + 5
          return prev
        })
      }, 300)

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
      setUploadProgress(100)

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
    <div>
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
            <div className="bg-gray-100 p-3 rounded-full mr-3">{getFileIcon(file.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <p className="text-xs text-gray-500">{file.type || "Невідомий тип файлу"}</p>
            </div>
            <button onClick={handleCancel} className="ml-2 text-gray-400 hover:text-gray-600" title="Скасувати">
              <X size={20} />
            </button>
          </div>
        ) : (
          <div
            ref={dropZoneRef}
            className={`
            relative min-h-[300px] border-2 border-dashed rounded-lg
            transition-colors duration-200 ease-in-out
            flex flex-col items-center justify-center
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-lg font-medium mb-1">
                {isDragActive ? "Відпустіть файл для завантаження" : "Перетягніть файл сюди"}
              </p>
              <p className="text-sm text-gray-500 mb-4">або</p>
              <Button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="mx-auto">
                Вибрати файл
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,audio/*,video/*,application/pdf"
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
            <Button onClick={handleUpload} className="w-full admin-button admin-button-primary">
              <Upload className="mr-2 h-4 w-4" />
              Завантажити файл
            </Button>
          )}

          {!isUploading && !success && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={
                file ? "w-1/2 admin-button admin-button-secondary" : "w-full admin-button admin-button-secondary"
              }
            >
              {file ? "Вибрати інший файл" : "Вибрати файл"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

