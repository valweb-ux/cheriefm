"use client"

import { useState } from "react"
import Link from "next/link"
import { MediaLibrary } from "@/components/admin/MediaLibrary"
import { Upload, ArrowLeft } from "lucide-react"

export default function MediaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div>
      <h1 className="admin-page-title">Медіа-бібліотека</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Управління зображеннями та іншими медіа-файлами. Ви можете завантажувати нові файли, переглядати та видаляти
          існуючі.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <Link href="/admin" className="admin-button admin-button-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" style={{ display: "inline" }} />
          Назад
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Медіа-файли</h2>
            </div>
            <div className="dashboard-widget-content">
              <MediaLibrary viewMode={viewMode} />
            </div>
          </div>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Дії</h2>
            </div>
            <div className="dashboard-widget-content">
              <Link href="/admin/media/upload-universal" className="admin-button admin-button-primary w-full mb-3">
                <Upload className="mr-2 h-4 w-4" style={{ display: "inline" }} />
                Завантажити файл
              </Link>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium mb-2">Режим перегляду:</h4>
                <div className="flex space-x-2">
                  <button
                    className={`admin-button ${viewMode === "grid" ? "admin-button-primary" : "admin-button-secondary"}`}
                    onClick={() => setViewMode("grid")}
                    style={{ flex: 1 }}
                  >
                    Сітка
                  </button>
                  <button
                    className={`admin-button ${viewMode === "list" ? "admin-button-primary" : "admin-button-secondary"}`}
                    onClick={() => setViewMode("list")}
                    style={{ flex: 1 }}
                  >
                    Список
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Інформація</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <h4 className="font-medium mb-2">Підтримувані формати:</h4>
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

              <div>
                <h4 className="font-medium mb-2">Рекомендації:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Максимальний розмір файлу: 30MB</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Для великих файлів використовуйте зовнішні сервіси</span>
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

