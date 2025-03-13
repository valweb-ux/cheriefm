"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { VideoUploader } from "@/components/admin/VideoUploader"

export default function UploadVideoPage() {
  const router = useRouter()

  return (
    <>
      <h1 className="admin-page-title">Завантаження відео</h1>

      <div className="admin-notice admin-notice-info">
        <p>Спеціальний завантажувач для відеофайлів. Рекомендовані формати: MP4, WebM. Максимальний розмір: 100MB.</p>
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
              <h2 className="dashboard-widget-title">Завантаження відео</h2>
            </div>
            <div className="dashboard-widget-content">
              <VideoUploader />
            </div>
          </div>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Рекомендації</h2>
            </div>
            <div className="dashboard-widget-content">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Використовуйте формати MP4 або WebM для найкращої сумісності</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Обмежте розмір файлу до 100MB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Для великих відеофайлів рекомендуємо використовувати сервіси на кшталт YouTube або Vimeo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>
                    Якщо у вас виникають проблеми з завантаженням, спробуйте конвертувати відео в інший формат або
                    зменшити його розмір
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

