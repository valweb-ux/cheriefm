"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, List, Upload } from "lucide-react"
import { MediaLibrary } from "@/components/admin/MediaLibrary"
import Link from "next/link"

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploadForm, setShowUploadForm] = useState(false)

  return (
    <>
      <AdminPageHeader
        title="Медіа-бібліотека"
        description="Управління зображеннями та іншими медіа-файлами"
        breadcrumbs={[{ label: "Адмінпанель", href: "/admin" }, { label: "Медіа-бібліотека" }]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/media/direct-upload">
                <Upload className="mr-2 h-4 w-4" />
                Пряме завантаження
              </Link>
            </Button>
            <Button onClick={() => setShowUploadForm(!showUploadForm)}>
              <Upload className="mr-2 h-4 w-4" />
              Додати новий
            </Button>
          </div>
        }
      />

      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all">Всі медіа</TabsTrigger>
              <TabsTrigger value="images">Зображення</TabsTrigger>
              <TabsTrigger value="documents">Документи</TabsTrigger>
              <TabsTrigger value="audio">Аудіо</TabsTrigger>
              <TabsTrigger value="video">Відео</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <div className="border rounded-md flex">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {showUploadForm && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-lg font-medium mb-4">Додати нові медіа</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Перетягніть файли сюди або</p>
                <Button variant="outline" className="mt-2">
                  Вибрати файли
                </Button>
                <input type="file" multiple className="hidden" id="media-upload" />
                <p className="mt-1 text-xs text-gray-500">Максимальний розмір файлу: 10MB</p>
                <p className="mt-1 text-xs text-blue-500">
                  <Link href="/admin/media/direct-upload">
                    Для великих файлів (до 100MB) використовуйте пряме завантаження
                  </Link>
                </p>
              </div>
            </div>
          )}

          <MediaLibrary viewMode={viewMode} />
        </div>
      </div>
    </>
  )
}

