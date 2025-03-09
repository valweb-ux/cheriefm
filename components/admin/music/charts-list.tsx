"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Edit, Trash2, Music } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"
import { getCharts, updateChart, deleteChart } from "@/lib/services/charts-service"
import type { Chart } from "@/types/music.types"

export default function ChartsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")

  const [charts, setCharts] = useState<Chart[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(pageParam ? Number.parseInt(pageParam) : 1)
  const [searchQuery, setSearchQuery] = useState(searchParam || "")
  const [isSearching, setIsSearching] = useState(false)
  const limit = 10

  useEffect(() => {
    loadCharts()
  }, [currentPage])

  const loadCharts = async () => {
    try {
      setLoading(true)
      const { data, count } = await getCharts(currentPage, limit, searchQuery)
      setCharts(data)
      setCount(count)
    } catch (error) {
      console.error("Error loading charts:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити чарти",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setCurrentPage(1)
    loadCharts()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
    setIsSearching(true)
    setTimeout(() => {
      loadCharts()
    }, 0)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push(`/admin/music/charts?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`)
  }

  const handleToggleActive = async (chart: Chart) => {
    try {
      await updateChart(chart.id, { is_active: !chart.is_active })
      setCharts(charts.map((c) => (c.id === chart.id ? { ...c, is_active: !chart.is_active } : c)))
      toast({
        title: "Успішно",
        description: `Чарт ${!chart.is_active ? "активовано" : "деактивовано"}`,
      })
    } catch (error) {
      console.error("Error toggling chart active state:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося змінити статус чарту",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей чарт?")) return

    try {
      await deleteChart(id)
      setCharts(charts.filter((chart) => chart.id !== id))
      toast({
        title: "Успішно",
        description: "Чарт видалено",
      })
    } catch (error) {
      console.error("Error deleting chart:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити чарт",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            placeholder="Пошук чартів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Пошук..." : "Пошук"}
          </Button>
          {searchQuery && (
            <Button variant="outline" onClick={handleClearSearch} disabled={isSearching}>
              Очистити
            </Button>
          )}
        </form>

        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : charts.length === 0 ? (
          <div className="text-center py-8">
            <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Чартів не знайдено</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? "Спробуйте змінити параметри пошуку" : "Створіть свій перший чарт, щоб він з'явився тут"}
            </p>
            {!searchQuery && (
              <Button asChild className="mt-4">
                <Link href="/admin/music/charts/new">Створити чарт</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Назва</TableHead>
                    <TableHead>Період</TableHead>
                    <TableHead>Активний</TableHead>
                    <TableHead>Оновлено</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charts.map((chart) => (
                    <TableRow key={chart.id}>
                      <TableCell className="font-medium">{chart.title}</TableCell>
                      <TableCell>
                        {formatDate(chart.period_start)} - {formatDate(chart.period_end)}
                      </TableCell>
                      <TableCell>
                        <Switch checked={chart.is_active} onCheckedChange={() => handleToggleActive(chart)} />
                      </TableCell>
                      <TableCell>
                        {chart.last_updated ? (
                          <Badge variant="outline">{formatDate(chart.last_updated)}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Не оновлювався
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Відкрити меню</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/music/charts/${chart.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Редагувати
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/music/charts/${chart.id}/tracks`}>
                                <Music className="mr-2 h-4 w-4" />
                                Управління треками
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(chart.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Видалити
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {count > limit && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(count / limit)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

