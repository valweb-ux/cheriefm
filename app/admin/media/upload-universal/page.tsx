"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UniversalUploader } from "@/components/admin/UniversalUploader"

export default function UniversalUploadPage() {
  const router = useRouter()

  return (
    <div>
      <h1 className="admin-page-title">Завантаження файлів</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Універсальний завантажувач дозволяє завантажувати зображення, відео, аудіо та PDF файли розміром до 30MB
          безпосередньо до сховища даних.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Завантаження файлів</h2>
            </div>
            <div className="dashboard-widget-content">
              <UniversalUploader />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Link href="/admin/media" className="admin-button admin-button-secondary" style={{ marginRight: "10px" }}>
                <ArrowLeft className="mr-2 h-4 w-4" style={{ display: "inline" }} />
                Назад до медіатеки
              </Link>
            </div>
          </div>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Інформація</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <strong>Статус:</strong>
                <span className="ml-2 text-green-600">Готовий до завантаження</span>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Видимість:</strong> Публічна
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Максимальний розмір:</strong> 30MB
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Підтримувані формати</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <h4 className="font-medium mb-2">Зображення:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>JPG, PNG, GIF, WebP</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <h4 className="font-medium mb-2">Відео:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>MP4, WebM</span>
                  </li>
                </ul>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <h4 className="font-medium mb-2">Аудіо:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>MP3, WAV, OGG</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Документи:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>PDF</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

