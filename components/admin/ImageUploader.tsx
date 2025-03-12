"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, LinkIcon, X, Image } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { MediaLibrary } from "./MediaLibrary"

interface ImageUploaderProps {
  initialImageUrl?: string
  onImageUploaded: (url: string) => void
}

export function ImageUploader({ initialImageUrl, onImageUploaded }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [urlInput, setUrlInput] = useState<string>("")
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false)

  useEffect(() => {
    if (initialImageUrl) {
      console.log("ImageUploader: Отримано initialImageUrl:", initialImageUrl)
      setImageUrl(initialImageUrl)
      setPreviewUrl(initialImageUrl)
    }
  }, [initialImageUrl])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setErrorMessage("")

    try {
      console.log("Початок завантаження файлу:", file.name, file.type, file.size)
      setIsUploading(true)
      setUploadProgress(0)

      // Створюємо попередній перегляд
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Імітуємо початок завантаження
      setUploadProgress(30)

      // Створюємо FormData для завантаження файлу
      const formData = new FormData()
      formData.append("file", file)

      // Імітуємо прогрес завантаження
      setUploadProgress(50)

      // Завантажуємо файл через API
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      // Імітуємо прогрес завантаження
      setUploadProgress(70)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не вдалося завантажити файл")
      }

      const data = await response.json()

      // Імітуємо завершення завантаження
      setUploadProgress(100)

      // Встановлюємо URL зображення з нашої бази
      console.log("Файл успішно завантажено, отримано URL:", data.url)
      setImageUrl(data.url)
      onImageUploaded(data.url)
      console.log("ImageUploader: URL зображення передано через onImageUploaded:", data.url)
    } catch (error) {
      console.error("Помилка завантаження файлу:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося завантажити файл")
      // Скидаємо попередній перегляд, якщо завантаження не вдалося
      if (!imageUrl) {
        setPreviewUrl("")
      } else {
        setPreviewUrl(imageUrl)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlUpload = async () => {
    if (!urlInput) return

    setErrorMessage("")

    try {
      console.log("Початок завантаження зображення з URL:", urlInput)
      setIsUploading(true)
      setUploadProgress(0)

      // Перевіряємо URL
      if (!urlInput.startsWith("http")) {
        throw new Error("URL повинен починатися з http:// або https://")
      }

      // Імітуємо початок завантаження
      setUploadProgress(30)

      // Завантажуємо зображення з URL через API
      const response = await fetch("/api/upload-image-from-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: urlInput }),
      })

      // Імітуємо прогрес завантаження
      setUploadProgress(70)

      const data = await response.json()

      if (!response.ok) {
        if (data.corsIssue) {
          throw new Error(`${data.error} Спробуйте один з цих варіантів:
        1. Завантажте зображення на ваш комп'ютер і потім завантажте його через кнопку "Завантажити з комп'ютера"
        2. Використовуйте URL зображення з сайтів, які дозволяють крос-доменне завантаження (наприклад, imgur.com, postimages.org)`)
        }
        throw new Error(data.error || "Не вдалося завантажити зображення з URL")
      }

      // Імітуємо завершення завантаження
      setUploadProgress(100)

      // Встановлюємо URL зображення з нашої бази
      console.log("Зображення успішно завантажено з URL, отримано URL:", data.url)
      setImageUrl(data.url)
      setPreviewUrl(data.url)
      onImageUploaded(data.url)
      console.log("ImageUploader: URL зображення передано через onImageUploaded:", data.url)
      setShowUrlInput(false)
      setUrlInput("")
    } catch (error) {
      console.error("Помилка завантаження зображення з URL:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося завантажити зображення з URL")
      // Скидаємо попередній перегляд, якщо завантаження не вдалося
      if (!imageUrl) {
        setPreviewUrl("")
      } else {
        setPreviewUrl(imageUrl)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    console.log("ImageUploader: Видалення зображення")
    setImageUrl("")
    setPreviewUrl("")
    onImageUploaded("")
    setErrorMessage("")
  }

  const handleSelectFromLibrary = (url: string) => {
    console.log("ImageUploader: Вибрано зображення з медіа-бібліотеки:", url)
    setImageUrl(url)
    setPreviewUrl(url)
    onImageUploaded(url)
    setShowMediaLibrary(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {previewUrl ? (
          <div className="relative mb-4">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Попередній перегляд"
              className="max-w-full max-h-[300px] rounded-md object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              title="Видалити зображення"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mb-4">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Завантажте заголовне зображення</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        {errorMessage && (
          <div className="w-full text-red-500 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Завантажити з комп'ютера
          </Button>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

          <Button type="button" variant="outline" onClick={() => setShowUrlInput(!showUrlInput)} disabled={isUploading}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Завантажити за URL
          </Button>

          <Button type="button" variant="outline" onClick={() => setShowMediaLibrary(true)}>
            <Image className="mr-2 h-4 w-4" />
            Вибрати з медіатеки
          </Button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Введіть URL зображення"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isUploading}
          />
          <Button type="button" onClick={handleUrlUpload} disabled={isUploading || !urlInput}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Завантажити"}
          </Button>
        </div>
      )}

      <Modal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        title="Медіа-бібліотека"
        className="max-w-4xl"
      >
        <div className="mt-4">
          <MediaLibrary onSelectImage={handleSelectFromLibrary} isModal={true} />
        </div>
      </Modal>
    </div>
  )
}

