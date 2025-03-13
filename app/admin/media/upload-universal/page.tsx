"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { UniversalUploader } from "@/components/admin/UniversalUploader"

export default function UniversalUploadPage() {
  const router = useRouter()

  return (
    <>
      <h1 className="admin-page-title">Завантаження файлів</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Універсальний завантажувач дозволяє завантажувати зображення, відео, аудіо та PDF файли розміром до 30MB
          безпосередньо до сховища даних.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => router.back()} className="admin-button admin-button-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" style={{ display: "inline" }} />
          Назад
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <UniversalUploader />
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Про універсальний завантажувач</h2>
            </div>
            <div className="dashboard-widget-content">
              <p className="text-sm text-gray-600 mb-4">
                Цей завантажувач поєднує в собі найкращі функції всіх попередніх завантажувачів, дозволяючи ефективно
                завантажувати різні типи файлів.
              </p>

              <h4 className="font-medium text-sm mb-2">Переваги:</h4>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Підтримка файлів розміром до 30MB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Пряме завантаження до сховища даних</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Попередній перегляд для зображень та відео</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Підтримка drag-and-drop</span>
                </li>
              </ul>

              <h4 className="font-medium text-sm mb-2">Підтримувані типи файлів:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Зображення: JPG, PNG, GIF, WebP</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Відео: MP4, WebM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Аудіо: MP3, WAV, OGG</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Документи: PDF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

