"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Artist } from "@/types/music.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit2Icon, MoreVerticalIcon, SearchIcon, TrashIcon, ExternalLinkIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { deleteArtist } from "@/lib/services/artists-service"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ArtistsList({
  artists,
  totalCount,
  currentPage,
  pageSize,
  search,
  featured,
  active,
}: {
  artists: Artist[]
  totalCount: number
  currentPage: number
  pageSize: number
  search: string
  featured?: boolean
  active?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(search)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    return newParams.toString()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(
      `${pathname}?${createQueryString({
        search: searchValue || null,
        page: "1",
      })}`,
    )
  }

  const handleFeaturedChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        featured: value === "all" ? null : value,
        page: "1",
      })}`,
    )
  }

  const handleActiveChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        active: value === "all" ? null : value,
        page: "1",
      })}`,
    )
  }

  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: page.toString(),
      })}`,
    )
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)
      await deleteArtist(id)
      toast({
        title: "Артиста видалено",
        description: "Артиста успішно видалено з бази даних",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting artist:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити артиста",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-80">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Пошук артистів..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button type="submit">Пошук</Button>
        </form>

        <div className="flex gap-2">
          <Select
            defaultValue={featured === undefined ? "all" : featured ? "true" : "false"}
            onValueChange={handleFeaturedChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Рекомендовані" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі артисти</SelectItem>
              <SelectItem value="true">Рекомендовані</SelectItem>
              <SelectItem value="false">Не рекомендовані</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={active === undefined ? "all" : active ? "true" : "false"}
            onValueChange={handleActiveChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі артисти</SelectItem>
              <SelectItem value="true">Активні</SelectItem>
              <SelectItem value="false">Неактивні</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Артист</TableHead>
              <TableHead>Країна</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата створення</TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Артистів не знайдено
                </TableCell>
              </TableRow>
            ) : (
              artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={artist.image_url || ""} alt={artist.name} />
                        <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-sm text-muted-foreground">@{artist.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{artist.country || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {artist.is_active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Активний
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Неактивний
                        </Badge>
                      )}
                      {artist.is_featured && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Рекомендований
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(artist.created_at)}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">Відкрити меню</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/music/artists/${artist.id}`}>
                              <Edit2Icon className="mr-2 h-4 w-4" />
                              Редагувати
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/artists/${artist.slug}`} target="_blank">
                              <ExternalLinkIcon className="mr-2 h-4 w-4" />
                              Переглянути
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600">
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Видалити
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ця дія не може бути скасована. Це назавжди видалить артиста &quot;{artist.name}&quot; та всі
                            пов&apos;язані з ним дані з нашої бази даних.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Скасувати</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(artist.id)}
                            disabled={isDeleting === artist.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting === artist.id ? "Видалення..." : "Видалити"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > 0 && (
        <Pagination
          totalItems={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

