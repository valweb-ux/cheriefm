"use client"

import { useState } from "react"
import Link from "next/link"
import { MediaLibrary } from "@/components/admin/MediaLibrary"
import { Grid, List, Upload } from "lucide-react"

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploadForm, setShowUploadForm] = useState(false)

  return (
    <>
      <h1 className="admin-page-title">Медіа-бібліотека</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Управління зображеннями та іншими медіа-файлами. Ви можете завантажувати нові файли, переглядати та видаляти
          існуючі.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <Link
            href="/admin/media/direct-upload"
            className="admin-button admin-button-secondary"
            style={{ marginRight: "10px" }}
          >
            <Upload className="mr-2 h-4 w-4" style={{ display: "inline" }} />
            Пряме завантаження
          </Link>
          <button onClick={() => setShowUploadForm(!showUploadForm)} className="admin-button admin-button-primary">
            <Upload className="mr-2 h-4 w-4" style={{ display: "inline" }} />
            Додати новий
          </button>
        </div>

        <div>
          <button
            onClick={() => setViewMode("grid")}
            className={`admin-button ${viewMode === "grid" ? "admin-button-primary" : "admin-button-secondary"}`}
            style={{ marginRight: "5px" }}
          >
            <Grid size={16} style={{ display: "inline", marginRight: "5px" }} />
            Сітка
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`admin-button ${viewMode === "list" ? "admin-button-primary" : "admin-button-secondary"}`}
          >
            <List size={16} style={{ display: "inline", marginRight: "5px" }} />
            Список
          </button>
        </div>
      </div>

      <div className="dashboard-widget">
        <div className="dashboard-widget-header">
          <h2 className="dashboard-widget-title">Медіа-файли</h2>
        </div>
        <div className="dashboard-widget-content">
          {showUploadForm && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-lg font-medium mb-4">Додати нові медіа</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Перетягніть файли сюди або</p>
                <button className="admin-button admin-button-secondary mt-2">Вибрати файли</button>
                <input type="file" multiple className="hidden" id="media-upload" />
                <p className="mt-1 text-xs text-gray-500">Максимальний розмір файлу: 10MB</p>
                <p className="mt-1 text-xs">
                  <Link href="/admin/media/direct-upload" className="admin-link">
                    Для великих файлів (до 100MB) використовуйте пряме завантаження
                  </Link>
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium text-sm ${viewMode === "all" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setViewMode("grid")}
              >
                Всі медіа
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${viewMode === "images" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Зображення
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${viewMode === "documents" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Документи
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${viewMode === "audio" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Аудіо
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${viewMode === "video" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Відео
              </button>
            </div>
          </div>

          <MediaLibrary viewMode={viewMode} />
        </div>
      </div>
    </>
  )
}

