"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Track } from "@/types/music.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Edit2Icon, MoreVerticalIcon, SearchIcon, TrashIcon, ExternalLinkIcon, PlayIcon } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { deleteTrack } from "@/lib/services/tracks-service"
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

export function TracksList({
  tracks,
  totalCount,
  currentPage,
  pageSize,
  search,
  artistId,
  genre,
  featured,
  active,
}: {
  tracks: Track[]
  totalCount: number
  currentPage: number
  pageSize: number
  search: string
  artistId?: string
  genre?: string
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
      await deleteTrack(id)
      toast({
        title: "Трек видалено",
        description: "Трек успішно видалено з бази даних",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting track:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити трек",
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
              placeholder="Пошук треків..."
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
              <SelectItem value="all">Всі треки</SelectItem>
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
              <SelectItem value="all">Всі треки</SelectItem>
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
              <TableHead>Трек</TableHead>
              <TableHead>Артист</TableHead>
              <TableHead>Тривалість</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Прослуховування</TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Треків не знайдено
                </TableCell>
              </TableRow>
            ) : (
              tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-secondary">
                        {track.cover_url ? (
                          <img
                            src={track.cover_url || "/placeholder.svg"}
                            alt={track.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <PlayIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-muted-foreground">{track.album || "Сингл"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {track.artists ? (
                      <Link href={`/artists/${track.artists.slug}`} className="hover:underline">
                        {track.artists.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{track.duration ? formatDuration(track.duration) : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {track.is_active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Активний
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Неактивний
                        </Badge>
                      )}
                      {track.is_featured && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Рекомендований
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{track.play_count.toLocaleString()}</TableCell>
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
                            <Link href={`/admin/music/tracks/${track.id}`}>
                              <Edit2Icon className="mr-2 h-4 w-4" />
                              Редагувати
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tracks/${track.slug}`} target="_blank">
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
                            Ця дія не може бути скасована. Це назавжди видалить трек &quot;{track.title}&quot; та всі
                            пов&apos;язані з ним дані з нашої бази даних.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Скасувати</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(track.id)}
                            disabled={isDeleting === track.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting === track.id ? "Видалення..." : "Видалити"}
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

