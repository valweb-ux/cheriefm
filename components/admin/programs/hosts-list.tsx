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
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Host {
  id: string
  name: string
  email: string | null
  photo: string | null
  is_active: boolean
  programs: string[] | null
}

export function HostsList() {
  const router = useRouter()
  const { toast } = useToast()
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Функція для завантаження даних
  const fetchHosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/hosts?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`)

      if (!response.ok) {
        throw new Error(`Помилка завантаження: ${response.status}`)
      }

      const data = await response.json()
      setHosts(data.data)
      setTotalItems(data.count)
      setTotalPages(Math.ceil(data.count / itemsPerPage))
    } catch (error) {
      console.error("Помилка при завантаженні ведучих:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося завантажити ведучих",
        variant: "destructive",
      })
      setHosts([])
    } finally {
      setLoading(false)
    }
  }

  // Завантажуємо дані при зміні сторінки або пошукового запиту
  useEffect(() => {
    fetchHosts()
  }, [currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Скидаємо на першу сторінку при пошуку
    fetchHosts()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цього ведучого?")) {
      try {
        const response = await fetch(`/api/admin/hosts/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`Помилка видалення: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          toast({
            title: "Успішно",
            description: "Ведучого видалено",
          })
          fetchHosts() // Оновлюємо список
        } else {
          throw new Error(result.message || "Помилка при видаленні")
        }
      } catch (error) {
        console.error("Помилка при видаленні ведучого:", error)
        toast({
          title: "Помилка",
          description: error instanceof Error ? error.message : "Не вдалося видалити ведучого",
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
            placeholder="Пошук ведучих..."
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
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Ім'я</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Програми</TableHead>
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
            ) : hosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Ведучих не знайдено
                </TableCell>
              </TableRow>
            ) : (
              hosts.map((host) => (
                <TableRow key={host.id}>
                  <TableCell>
                    {host.photo ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image src={host.photo || "/placeholder.svg"} alt={host.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-medium">{host.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{host.name}</TableCell>
                  <TableCell>{host.email || "—"}</TableCell>
                  <TableCell>
                    {host.programs && host.programs.length > 0 ? (
                      <Badge variant="outline">{host.programs.length} програм</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        host.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {host.is_active ? "Активний" : "Неактивний"}
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
                        <DropdownMenuItem onClick={() => router.push(`/hosts/${host.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Переглянути</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/hosts/${host.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Редагувати</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(host.id)}
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

