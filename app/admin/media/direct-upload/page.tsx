"use client"

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { DirectUploader } from "@/components/admin/DirectUploader"

export default function DirectUploadPage() {
  const router = useRouter()

  return (
    <>
      <AdminPageHeader
        title="Пряме завантаження файлів"
        breadcrumbs={[
          { label: "Адмінпанель", href: "/admin" },
          { label: "Медіа", href: "/admin/media" },
          { label: "Пряме завантаження" },
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
          <DirectUploader />
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Про пряме завантаження</h3>
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
    </>
  )
}

