"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, MessageSquare, ChevronUp, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { getAllNews } from "@/lib/supabase"
import type { News } from "@/types/supabase"

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([])
  const [totalNews, setTotalNews] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState<"title" | "date">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const router = useRouter()
  const pageSize = 20

  useEffect(() => {
    fetchNews()
  }, [currentPage, searchQuery, dateFilter, categoryFilter, sortField, sortDirection])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const { news, total } = await getAllNews(currentPage, pageSize)
      setNews(news)
      setTotalNews(total)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: "title" | "date") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(news.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (!selectedItems.length) return

    if (action === "delete") {
      if (confirm(`Ви впевнені, що хочете видалити ${selectedItems.length} новин(у)?`)) {
        // Implement bulk delete
        console.log("Deleting items:", selectedItems)
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchNews()
  }

  const SortIcon = ({ field }: { field: "title" | "date" }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div>
      <h1 className="admin-page-title">Всі новини</h1>

      <div className="admin-notice admin-notice-info">
        <p>
          Тут ви можете переглядати, редагувати та видаляти новини. Використовуйте фільтри для пошуку конкретних новин.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <Link href="/admin/edit/new" className="admin-button admin-button-primary">
            <PlusCircle className="mr-2 h-4 w-4" style={{ display: "inline" }} />
            Додати новину
          </Link>
        </div>
        <div>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук новин"
              className="admin-form-input"
              style={{ width: "300px" }}
            />
            <button type="submit" className="admin-button admin-button-secondary">
              <Search className="mr-2 h-4 w-4" style={{ display: "inline" }} />
              Пошук
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-widget">
        <div className="dashboard-widget-header">
          <h2 className="dashboard-widget-title">Список новин</h2>
        </div>
        <div className="dashboard-widget-content">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                className="admin-form-select"
                style={{ width: "180px" }}
                onChange={(e) => handleBulkAction(e.target.value)}
              >
                <option value="bulk">Масові дії</option>
                <option value="delete">Видалити</option>
              </select>
              <button className="admin-button admin-button-secondary">Застосувати</button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                className="admin-form-select"
                style={{ width: "150px" }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Всі дати</option>
                <option value="today">Сьогодні</option>
                <option value="yesterday">Вчора</option>
                <option value="week">За тиждень</option>
                <option value="month">За місяць</option>
              </select>

              <select
                className="admin-form-select"
                style={{ width: "150px" }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Всі категорії</option>
                <option value="news">Новини</option>
                <option value="events">Події</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-3">
            {isLoading ? "Завантаження..." : `Показано ${news.length} з ${totalNews} новин`}
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === news.length && news.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th style={{ cursor: "pointer" }} onClick={() => handleSort("title")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      Заголовок
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th>Автор</th>
                  <th>Категорії</th>
                  <th>Теги</th>
                  <th style={{ width: "100px" }}>Коментарі</th>
                  <th style={{ cursor: "pointer", width: "150px" }} onClick={() => handleSort("date")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      Дата
                      <SortIcon field="date" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <div>
                        <Link href={`/admin/edit/${item.id}`} className="admin-link">
                          {item.title}
                        </Link>
                        <div style={{ fontSize: "12px", marginTop: "5px" }}>
                          <Link href={`/admin/edit/${item.id}`} className="admin-link">
                            Редагувати
                          </Link>
                          {" | "}
                          <button
                            onClick={() => {
                              if (confirm("Ви впевнені, що хочете видалити цю новину?")) {
                                // Implement delete
                              }
                            }}
                            className="admin-link"
                            style={{ color: "#d63638" }}
                          >
                            Видалити
                          </button>
                          {" | "}
                          <Link href={`/news/${item.id}`} className="admin-link">
                            Переглянути
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>Адмін</td>
                    <td>Новини</td>
                    <td>—</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <MessageSquare className="h-4 w-4" style={{ color: "#8c8f94" }} />
                        <span>0</span>
                      </div>
                    </td>
                    <td>
                      <div>{format(new Date(item.publish_date || item.created_at), "d MMMM yyyy", { locale: uk })}</div>
                      <div style={{ fontSize: "12px", color: "#8c8f94" }}>
                        {format(new Date(item.publish_date || item.created_at), "HH:mm")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                className="admin-form-select"
                style={{ width: "180px" }}
                onChange={(e) => handleBulkAction(e.target.value)}
              >
                <option value="bulk">Масові дії</option>
                <option value="delete">Видалити</option>
              </select>
              <button className="admin-button admin-button-secondary">Застосувати</button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                className="admin-button admin-button-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Попередня
              </button>
              <span style={{ color: "#646970" }}>
                Сторінка {currentPage} з {Math.ceil(totalNews / pageSize)}
              </span>
              <button
                className="admin-button admin-button-secondary"
                disabled={currentPage >= Math.ceil(totalNews / pageSize)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Наступна
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

