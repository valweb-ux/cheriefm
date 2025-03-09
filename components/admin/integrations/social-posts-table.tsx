"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
  CalendarIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { SocialMediaPost } from "@/types/integrations.types"
import { deleteSocialMediaPost, republishSocialMediaPost } from "@/lib/actions/social-media-actions"

interface SocialPostsTableProps {
  posts: SocialMediaPost[]
  count: number
  page: number
  perPage: number
  status: string
}

export default function SocialPostsTable({ posts, count, page, perPage, status }: SocialPostsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const totalPages = Math.ceil(count / perPage)

  const handleDelete = async (id: string) => {
    try {
      setLoading(id)
      const result = await deleteSocialMediaPost(id)

      if (result.success) {
        toast({
          title: "Публікацію видалено",
          description: "Публікацію в соціальних мережах успішно видалено",
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка видалення публікації",
          description: result.error || "Не вдалося видалити публікацію в соціальних мережах",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Помилка видалення публікації",
        description: "Сталася помилка при видаленні публікації в соціальних мережах",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRepublish = async (id: string) => {
    try {
      setLoading(id)
      const result = await republishSocialMediaPost(id)

      if (result.success) {
        toast({
          title: "Публікацію повторно опубліковано",
          description: "Публікацію в соціальних мережах успішно повторно опубліковано",
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка повторної публікації",
          description: result.error || "Не вдалося повторно опублікувати в соціальних мережах",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error republishing post:", error)
      toast({
        title: "Помилка повторної публікації",
        description: "Сталася помилка при повторній публікації в соціальних мережах",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleStatusChange = (value: string) => {
    router.push(`/admin/integrations/social-media?tab=posts&status=${value}&page=1&perPage=${perPage}`)
  }

  const handlePerPageChange = (value: string) => {
    router.push(`/admin/integrations/social-media?tab=posts&status=${status}&page=1&perPage=${value}`)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <FacebookIcon className="h-4 w-4 text-blue-600" />
      case "twitter":
        return <TwitterIcon className="h-4 w-4 text-sky-500" />
      case "instagram":
        return <InstagramIcon className="h-4 w-4 text-pink-600" />
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4 text-blue-700" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckIcon className="h-3 w-3 mr-1" /> Опубліковано
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CalendarIcon className="h-3 w-3 mr-1" /> Заплановано
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XIcon className="h-3 w-3 mr-1" /> Помилка
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <ClockIcon className="h-3 w-3 mr-1" /> В обробці
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Статус:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Всі статуси" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value="published">Опубліковано</SelectItem>
              <SelectItem value="scheduled">Заплановано</SelectItem>
              <SelectItem value="failed">Помилка</SelectItem>
              <SelectItem value="pending">В обробці</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Показувати по:</span>
          <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Платформи</TableHead>
              <TableHead>Контент</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата публікації</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Немає публікацій в соціальних мережах
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex space-x-1">
                      {post.platforms.map((platform) => (
                        <div key={platform} className="w-6 h-6 flex items-center justify-center">
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">
                      {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : post.scheduledFor
                        ? new Date(post.scheduledFor).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={loading === post.id}>
                          {loading === post.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontalIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(post.postUrl, "_blank")} disabled={!post.postUrl}>
                          <ExternalLinkIcon className="mr-2 h-4 w-4" />
                          Переглянути публікацію
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRepublish(post.id)}
                          disabled={post.status === "scheduled" || post.status === "pending"}
                        >
                          <RefreshCwIcon className="mr-2 h-4 w-4" />
                          Опублікувати повторно
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-red-600">
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Видалити
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/admin/integrations/social-media?tab=posts&status=${status}&page=${Math.max(1, page - 1)}&perPage=${perPage}`}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`/admin/integrations/social-media?tab=posts&status=${status}&page=${pageNum}&perPage=${perPage}`}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={`/admin/integrations/social-media?tab=posts&status=${status}&page=${Math.min(totalPages, page + 1)}&perPage=${perPage}`}
                aria-disabled={page >= totalPages}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

