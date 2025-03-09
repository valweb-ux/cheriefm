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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PlayCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { deleteProgram } from "@/lib/supabase/api"

interface Program {
  id: string
  title: string
  host: string | null
  day_of_week: string
  air_time: string
  is_active: boolean
}

const dayOfWeekOptions = [
  { value: "", label: "Всі дні" },
  { value: "monday", label: "Понеділок" },
  { value: "tuesday", label: "Вівторок" },
  { value: "wednesday", label: "Середа" },
  { value: "thursday", label: "Четвер" },
  { value: "friday", label: "П'ятниця" },
  { value: "saturday", label: "Субота" },
  { value: "sunday", label: "Неділя" },
]

export function ProgramsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dayFilter, setDayFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Функція для завантаження даних
  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/programs?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&day=${dayFilter}`,
      )

      if (!response.ok) {
        throw new Error(`Помилка завантаження: ${response.status}`)
      }

      const data = await response.json()
      setPrograms(data.data)
      setTotalItems(data.count)
      setTotalPages(Math.ceil(data.count / itemsPerPage))
    } catch (error) {
      console.error("Помилка при завантаженні програм:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося завантажити програми",
        variant: "destructive",
      })
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  // Завантажуємо дані при зміні сторінки, пошукового запиту або фільтра
  useEffect(() => {
    fetchPrograms()
  }, [currentPage, searchQuery, dayFilter])

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const translateDayOfWeek = (day: string) => {
    const translations: Record<string, string> = {
      monday: "Понеділок",
      tuesday: "Вівторок",
      wednesday: "Середа",
      thursday: "Четвер",
      friday: "П'ятниця",
      saturday: "Субота",
      sunday: "Неділя",
    }
    return translations[day] || day
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Скидаємо на першу сторінку при пошуку
    fetchPrograms()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цю програму?")) {
      try {
        const result = await deleteProgram(id)

        if (result.success) {
          toast({
            title: "Успішно",
            description: "Програму видалено",
          })
          fetchPrograms() // Оновлюємо список
        } else {
          throw new Error(result.error || "Помилка при видаленні")
        }
      } catch (error) {
        console.error("Помилка при видаленні програми:", error)
        toast({
          title: "Помилка",
          description: error instanceof Error ? error.message : "Не вдалося видалити програму",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex items-center flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук програм..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2">
            Пошук
          </Button>
        </form>

        <div className="w-full md:w-64">
          <Select
            value={dayFilter}
            onValueChange={(value) => {
              setDayFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Фільтр за днем" />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Назва програми</TableHead>
              <TableHead>Ведучий</TableHead>
              <TableHead>День тижня</TableHead>
              <TableHead>Час ефіру</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Програм не знайдено
                </TableCell>
              </TableRow>
            ) : (
              programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell>{program.host || "—"}</TableCell>
                  <TableCell>{translateDayOfWeek(program.day_of_week)}</TableCell>
                  <TableCell>{formatTime(program.air_time)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        program.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {program.is_active ? "Активна" : "Неактивна"}
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/programs/${program.id}`)}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          <span>Епізоди</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/programs/${program.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Переглянути</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/programs/edit/${program.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Редагувати</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(program.id)}
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

