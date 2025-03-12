"use client"

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { VideoUploader } from "@/components/admin/VideoUploader"

export default function UploadVideoPage() {
  const router = useRouter()

  return (
    <>
      <AdminPageHeader
        title="Завантаження відео"
        breadcrumbs={[
          { label: "Адмінпанель", href: "/admin" },
          { label: "Медіа", href: "/admin/media" },
          { label: "Завантаження відео" },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VideoUploader />
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Рекомендації</h3>
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
    </>
  )
}

