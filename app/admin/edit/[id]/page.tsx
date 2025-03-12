"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getNewsById } from "../../../../lib/supabase"
import { format, addHours } from "date-fns"
import { ImageUploader } from "@/components/admin/ImageUploader"

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const isNewNews = params.id === "new"

  // Встановлюємо дату публікації на 1 годину вперед за замовчуванням для нових новин
  const defaultPublishDate = format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")
  const [publishDate, setPublishDate] = useState<string>(defaultPublishDate)
  const [publishStatus, setPublishStatus] = useState<"draft" | "publish" | "future">("publish")

  useEffect(() => {
    // Ініціалізуємо сторінку
    const initPage = async () => {
      try {
        // Перевіряємо та виправляємо налаштування RLS для storage
        await fetch("/api/fix-storage-rls")
      } catch (error) {
        console.error("Помилка при ініціалізації сторінки:", error)
      }
    }

    initPage()

    if (!isNewNews) {
      fetchNews()
    }
  }, [params.id, isNewNews])

  useEffect(() => {
    // Визначаємо статус публікації на основі дати
    const publishDateTime = new Date(publishDate)
    const now = new Date()

    if (publishDateTime > now) {
      setPublishStatus("future")
    } else {
      setPublishStatus("publish")
    }
  }, [publishDate])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const newsItem = await getNewsById(Number(params.id))
      if (newsItem) {
        console.log("Отримано дані новини:", newsItem)
        setTitle(newsItem.title)
        setContent(newsItem.content)
        setImageUrl(newsItem.image_url || "")
        console.log("Встановлено URL зображення:", newsItem.image_url)

        // Встановлюємо дату публікації з бази даних або використовуємо created_at
        if (newsItem.publish_date) {
          setPublishDate(format(new Date(newsItem.publish_date), "yyyy-MM-dd'T'HH:mm"))
        } else {
          setPublishDate(format(new Date(newsItem.created_at), "yyyy-MM-dd'T'HH:mm"))
        }

        // Визначаємо статус публікації
        const publishDateTime = new Date(newsItem.publish_date || newsItem.created_at)
        const now = new Date()

        if (publishDateTime > now) {
          setPublishStatus("future")
        } else {
          setPublishStatus("publish")
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      alert("Не вдалося завантажити новину")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      console.log("Збереження новини з наступними даними:")
      console.log("Заголовок:", title)
      console.log("Зміст:", content.substring(0, 100) + "...")
      console.log("Дата публікації:", publishDate)
      console.log("URL зображення:", imageUrl)

      if (isNewNews) {
        // Використовуємо API-ендпоінт для додавання новини
        const response = await fetch("/api/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            publish_date: publishDate,
            image_url: imageUrl,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Не вдалося додати новину")
        }

        const result = await response.json()
        console.log("Новину успішно додано:", result)
        alert("Новину успішно додано!")
      } else {
        // Використовуємо API-ендпоінт для оновлення новини
        const response = await fetch(`/api/news/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            publish_date: publishDate,
            image_url: imageUrl,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Не вдалося оновити новину")
        }

        const result = await response.json()
        console.log("Новину успішно оновлено:", result)
        alert("Новину успішно оновлено!")
      }
      router.push("/admin")
    } catch (error) {
      console.error("Error saving news:", error)
      alert(error instanceof Error ? error.message : "Не вдалося зберегти новину")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити цю новину?")) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/news/${params.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Не вдалося видалити новину")
        }

        alert("Новину успішно видалено!")
        router.push("/admin")
      } catch (error) {
        console.error("Error deleting news:", error)
        alert(error instanceof Error ? error.message : "Не вдалося видалити новину")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleImageUploaded = (url: string) => {
    console.log("Отримано URL зображення від ImageUploader:", url)
    setImageUrl(url)
  }

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  return (
    <div>
      <h1 className="admin-page-title">{isNewNews ? "Додати нову новину" : "Редагувати новину"}</h1>

      <div className="admin-notice admin-notice-info">
        <p>{isNewNews ? "Створіть нову новину, заповнивши форму нижче." : `Ви редагуєте новину "${title}".`}</p>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: "1" }}>
          <form onSubmit={handleSubmit}>
            <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
              <div className="dashboard-widget-content">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введіть заголовок тут"
                  className="admin-form-input"
                  style={{ fontSize: "1.7em", marginBottom: "10px" }}
                  required
                />

                {/* Компонент для завантаження зображень */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Заголовне зображення</h3>
                  <ImageUploader initialImageUrl={imageUrl} onImageUploaded={handleImageUploaded} />
                  {imageUrl && <div className="mt-2 text-sm text-green-600">URL зображення: {imageUrl}</div>}
                </div>

                {/* Використовуємо звичайний textarea замість WYSIWYG редактора */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Введіть зміст новини тут..."
                  className="admin-form-textarea"
                  style={{
                    minHeight: "300px",
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Ви можете використовувати HTML-теги для форматування тексту. Наприклад, &lt;b&gt;жирний
                  текст&lt;/b&gt;, &lt;i&gt;курсив&lt;/i&gt;, &lt;h2&gt;заголовок&lt;/h2&gt;,
                  &lt;ul&gt;&lt;li&gt;список&lt;/li&gt;&lt;/ul&gt;.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Link href="/admin" className="admin-button admin-button-secondary" style={{ marginRight: "10px" }}>
                  Скасувати
                </Link>
                {!isNewNews && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="admin-button"
                    style={{ color: "#d63638", borderColor: "#d63638" }}
                  >
                    Видалити
                  </button>
                )}
              </div>
              <button type="submit" className="admin-button admin-button-primary" disabled={isSaving}>
                {isSaving ? "Збереження..." : isNewNews ? "Опублікувати" : "Оновити"}
              </button>
            </div>
          </form>
        </div>

        <div style={{ width: "280px" }}>
          <div className="dashboard-widget" style={{ marginBottom: "20px" }}>
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Публікація</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <strong>Статус:</strong>
                <span className={`ml-2 ${publishStatus === "future" ? "text-orange-500" : "text-green-600"}`}>
                  {publishStatus === "future" ? "Заплановано" : "Опубліковано"}
                </span>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Видимість:</strong> Публічна
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Дата публікації:</strong>
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="admin-form-input"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {publishStatus === "future"
                    ? "Новина буде опублікована в зазначений час"
                    : "Новина буде опублікована негайно"}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="dashboard-widget-header">
              <h2 className="dashboard-widget-title">Категорії</h2>
            </div>
            <div className="dashboard-widget-content">
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <input type="checkbox" /> Новини
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <input type="checkbox" /> Події
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" /> Оголошення
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

