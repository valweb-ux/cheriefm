"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Pencil, Trash2, Eye, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { deleteNews } from "@/lib/supabase/api"

interface NewsItem {
  id: string
  title: string
  category: string
  publish_date: string
  is_published: boolean
}

export function NewsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Функція для завантаження даних
  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/news?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`)

      if (!response.ok) {
        throw new Error(`Помилка завантаження: ${response.status}`)
      }

      const data = await response.json()
      setNews(data.data)
      setTotalItems(data.count)
      setTotalPages(Math.ceil(data.count / itemsPerPage))
    } catch (error) {
      console.error("Помилка при завантаженні новин:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося завантажити новини",
        variant: "destructive",
      })
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  // Завантажуємо дані при зміні сторінки або пошукового запиту
  useEffect(() => {
    fetchNews()
  }, [currentPage, searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Скидаємо на першу сторінку при пошуку
    fetchNews()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цю новину?")) {
      try {
        const result = await deleteNews(id)

        if (result.success) {
          toast({
            title: "Успішно",
            description: "Новину видалено",
          })
          fetchNews() // Оновлюємо список
        } else {
          throw new Error(result.error || "Помилка при видаленні")
        }
      } catch (error) {
        console.error("Помилка при видаленні новини:", error)
        toast({
          title: "Помилка",
          description: error instanceof Error ? error.message : "Не вдалося видалити новину",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Пошук новин..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="ml-2">
          Пошук
        </Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Дата публікації</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Новин не знайдено
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{formatDate(item.publish_date)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.is_published ? "Опубліковано" : "Чернетка"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Меню</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Дії</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/news/${item.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Переглянути</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${item.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Редагувати</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Видалити</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Сторінка {currentPage} з {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

