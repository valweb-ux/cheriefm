"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { Upload, ArrowLeft, AlertCircle } from "lucide-react"

export default function UploadMediaPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState<string | null>(null)
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
        handleFiles(Array.from(e.dataTransfer.files))
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

  const handleFiles = async (files: File[]) => {
    if (isUploading) return

    setIsUploading(true)
    setError(null)

    for (const file of files) {
      try {
        // Перевірка типу файлу
        const isAllowedType =
          file.type.startsWith("image/") ||
          file.type.startsWith("audio/") ||
          file.type.startsWith("video/") ||
          file.type === "application/pdf"

        if (!isAllowedType) {
          throw new Error(`Тип файлу ${file.type} не підтримується. Дозволені типи: зображення, аудіо, відео, PDF.`)
        }

        // Перевірка розміру файлу (2GB)
        if (file.size > 2 * 1024 * 1024 * 1024) {
          throw new Error(`Файл ${file.name} перевищує максимальний розмір 2GB.`)
        }

        // Ініціалізуємо прогрес для файлу
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

        const formData = new FormData()
        formData.append("file", file)

        // Імітуємо прогрес завантаження
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[file.name] || 0
            if (currentProgress < 90) {
              return { ...prev, [file.name]: currentProgress + 10 }
            }
            return prev
          })
        }, 500)

        // Додаємо логування для відстеження процесу
        console.log(`Початок завантаження файлу: ${file.name}, тип: ${file.type}, розмір: ${file.size} байт`)

        // Спеціальна обробка для відеофайлів
        if (file.type.startsWith("video/")) {
          console.log("Завантаження відеофайлу - використовуємо спеціальну обробку")

          // Для відеофайлів обмежуємо розмір до 100MB для запобігання помилок
          if (file.size > 100 * 1024 * 1024) {
            throw new Error(
              `Відеофайл ${file.name} перевищує рекомендований розмір 100MB. Спробуйте зменшити розмір файлу або конвертувати його в інший формат.`,
            )
          }
        }

        try {
          const response = await fetch("/api/media", {
            method: "POST",
            body: formData,
          })

          clearInterval(progressInterval)

          // Спочатку отримуємо текст відповіді
          const responseText = await response.text()
          console.log(
            `Відповідь сервера (перші 200 символів): ${responseText.substring(0, 200)}${responseText.length > 200 ? "..." : ""}`,
          )

          let data
          try {
            // Потім намагаємося розібрати його як JSON
            data = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Помилка парсингу JSON:", parseError)

            // Спеціальне повідомлення для відеофайлів
            if (file.type.startsWith("video/")) {
              throw new Error(`Помилка при завантаженні відеофайлу. Можливі причини: 
              1. Файл занадто великий (рекомендовано до 100MB)
              2. Формат відео не підтримується (рекомендовано MP4 або WebM)
              3. Проблема з кодеком відео
              
              Технічні деталі: Сервер повернув невалідний JSON. Відповідь: ${responseText.substring(0, 100)}...`)
            } else {
              throw new Error(`Сервер повернув невалідний JSON. Відповідь: ${responseText.substring(0, 100)}...`)
            }
          }

          if (!response.ok) {
            throw new Error(data.error || `Помилка завантаження файлу ${file.name}`)
          }

          // Встановлюємо прогрес 100% після успішного завантаження
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
          console.log(`Файл ${file.name} успішно завантажено`)
        } catch (fetchError) {
          console.error("Помилка запиту:", fetchError)
          throw fetchError
        }
      } catch (error) {
        console.error("Помилка завантаження:", error)
        setError(error instanceof Error ? error.message : "Не вдалося завантажити файл")
        break
      }
    }

    setIsUploading(false)

    // Перенаправляємо на сторінку медіа-бібліотеки після успішного завантаження
    if (!error) {
      setTimeout(() => {
        router.push("/admin/media")
      }, 1000)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <AdminPageHeader
        title="Завантаження медіа файлів"
        breadcrumbs={[
          { label: "Адмінпанель", href: "/admin" },
          { label: "Медіа", href: "/admin/media" },
          { label: "Завантаження" },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div
          ref={dropZoneRef}
          className={`
            relative min-h-[300px] border-2 border-dashed rounded-lg
            transition-colors duration-200 ease-in-out
            flex flex-col items-center justify-center
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            accept="image/*,audio/*,video/*,application/pdf"
            className="hidden"
          />
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium mb-1">
              {isDragActive ? "Відпустіть файли для завантаження" : "Перетягніть файли сюди"}
            </p>
            <p className="text-sm text-gray-500 mb-4">або</p>
            <Button disabled={isUploading} onClick={handleSelectFilesClick}>
              Вибрати файли
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <details className="mt-2">
                <summary className="text-xs text-red-500 cursor-pointer">Показати технічні деталі</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {error}
                  {"\n\nЯкщо проблема повторюється, спробуйте:"}
                  {"\n1. Перевірити формат відеофайлу (рекомендовано MP4, WebM)"}
                  {"\n2. Зменшити розмір файлу"}
                  {"\n3. Конвертувати файл в інший формат"}
                </pre>
              </details>
            </div>
          </div>
        )}

        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 space-y-3">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{fileName}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-500">{progress}%</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Ви використовуєте багатофайловий завантажувач.{" "}
            <button className="text-primary hover:underline">Проблеми? Спробуйте звичайний завантажувач</button>
          </p>
          <p className="text-sm text-gray-500 mt-1">Максимальний розмір файлу: 2 GB</p>
        </div>
      </div>
    </>
  )
}

