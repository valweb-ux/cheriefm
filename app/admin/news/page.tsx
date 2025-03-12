"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
      <AdminPageHeader
        title="Всі новини"
        breadcrumbs={[{ label: "Адмінпанель", href: "/admin" }, { label: "Новини" }]}
        actions={
          <Button asChild>
            <Link href="/admin/edit/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Додати новину
            </Link>
          </Button>
        }
      />

      <div className="bg-white border rounded-md shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="bulk">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Масові дії" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulk">Масові дії</SelectItem>
                  <SelectItem value="delete">Видалити</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Застосувати
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Пошук новин"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Всі дати" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі дати</SelectItem>
                  <SelectItem value="today">Сьогодні</SelectItem>
                  <SelectItem value="yesterday">Вчора</SelectItem>
                  <SelectItem value="week">За тиждень</SelectItem>
                  <SelectItem value="month">За місяць</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Всі категорії" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі категорії</SelectItem>
                  <SelectItem value="news">Новини</SelectItem>
                  <SelectItem value="events">Події</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {isLoading ? "Завантаження..." : `Показано ${news.length} з ${totalNews} новин`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedItems.length === news.length}
                    onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                  />
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("title")}>
                  <div className="flex items-center gap-1">
                    Заголовок
                    <SortIcon field="title" />
                  </div>
                </th>
                <th className="p-3 text-left">Автор</th>
                <th className="p-3 text-left">Категорії</th>
                <th className="p-3 text-left">Теги</th>
                <th className="p-3 text-left w-[100px]">Коментарі</th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">
                    Дата
                    <SortIcon field="date" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked: boolean) => handleSelectItem(item.id, checked)}
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <Link href={`/admin/edit/${item.id}`} className="font-medium text-blue-600 hover:underline">
                        {item.title}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        <Link href={`/admin/edit/${item.id}`} className="text-blue-600 hover:underline">
                          Редагувати
                        </Link>
                        {" | "}
                        <button
                          onClick={() => {
                            if (confirm("Ви впевнені, що хочете видалити цю новину?")) {
                              // Implement delete
                            }
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Видалити
                        </button>
                        {" | "}
                        <Link href={`/news/${item.id}`} className="text-blue-600 hover:underline">
                          Переглянути
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">Адмін</td>
                  <td className="p-3">Новини</td>
                  <td className="p-3">—</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span>0</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="whitespace-nowrap">
                      {format(new Date(item.publish_date || item.created_at), "d MMMM yyyy", { locale: uk })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(item.publish_date || item.created_at), "HH:mm")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select defaultValue="bulk">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Масові дії" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulk">Масові дії</SelectItem>
                  <SelectItem value="delete">Видалити</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Застосувати
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Попередня
              </Button>
              <span className="text-sm text-gray-500">
                Сторінка {currentPage} з {Math.ceil(totalNews / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= Math.ceil(totalNews / pageSize)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Наступна
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

