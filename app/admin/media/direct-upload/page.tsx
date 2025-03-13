"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { DirectUploader } from "@/components/admin/DirectUploader"

export default function DirectUploadPage() {
  const router = useRouter()

  return (
    <>
      <h1 className="admin-page-title">Пряме завантаження файлів</h1>

      <div className="admin-notice admin-notice-info">
        <p>Цей метод дозволяє завантажувати файли безпосередньо до сховища даних, обходячи обмеження API-маршрутів.</p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => router.back()} className="admin-button admin-button-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" style={{ display: "inline" }} />
          Назад
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Завантаження файлів</h2>
            </div>
            <div className="dashboard-widget-content">
              <DirectUploader />
            </div>
          </div>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Про пряме завантаження</h2>
            </div>
            <div className="dashboard-widget-content">
              <p className="text-sm text-gray-600 mb-4">
                Цей метод дозволяє завантажувати файли безпосередньо до сховища даних, обходячи обмеження API-маршрутів.
              </p>

              <h4 className="font-medium text-sm mb-2">Переваги:</h4>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Підтримка файлів розміром до 50MB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Швидше завантаження</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Відображення прогресу завантаження</span>
                </li>
              </ul>

              <h4 className="font-medium text-sm mb-2">Рекомендації:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Для зображень рекомендовано формати JPEG, PNG або WebP з розміром до 10MB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Для відеофайлів використовуйте формати MP4 або WebM з розміром до 50MB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Для дуже великих файлів (понад 50MB) рекомендуємо використовувати зовнішні сервіси</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

