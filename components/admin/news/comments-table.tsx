"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { CheckIcon, XIcon, MessageSquareIcon, AlertTriangleIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

import type { Comment } from "@/types/comment.types"
import { approveComment, rejectComment, deleteComment } from "@/lib/actions/comment-actions"

interface CommentsTableProps {
  comments: Comment[]
  count: number
  page: number
  perPage: number
  newsId: string
  status: string
}

export default function CommentsTable({ comments, count, page, perPage, newsId, status }: CommentsTableProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const totalPages = Math.ceil(count / perPage)

  const handleStatusChange = (value: string) => {
    router.push(`/admin/news/${newsId}/comments?status=${value}&page=1&perPage=${perPage}`)
  }

  const handlePerPageChange = (value: string) => {
    router.push(`/admin/news/${newsId}/comments?status=${status}&page=1&perPage=${value}`)
  }

  const handleApprove = async (commentId: string) => {
    try {
      setIsProcessing(commentId)
      await approveComment(commentId)
      toast({
        title: "Коментар схвалено",
        description: "Коментар успішно опубліковано",
      })
      router.refresh()
    } catch (error) {
      console.error("Error approving comment:", error)
      toast({
        title: "Помилка схвалення",
        description: "Не вдалося схвалити коментар",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const handleReject = async (commentId: string) => {
    try {
      setIsProcessing(commentId)
      await rejectComment(commentId)
      toast({
        title: "Коментар відхилено",
        description: "Коментар успішно відхилено",
      })
      router.refresh()
    } catch (error) {
      console.error("Error rejecting comment:", error)
      toast({
        title: "Помилка відхилення",
        description: "Не вдалося відхилити коментар",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const handleDelete = async () => {
    if (!commentToDelete) return

    try {
      setIsDeleting(true)
      await deleteComment(commentToDelete)
      toast({
        title: "Коментар видалено",
        description: "Коментар успішно видалено",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Помилка видалення",
        description: "Не вдалося видалити коментар",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCommentToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Статус:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Всі коментарі" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі коментарі</SelectItem>
              <SelectItem value="pending">Очікують схвалення</SelectItem>
              <SelectItem value="approved">Схвалені</SelectItem>
              <SelectItem value="rejected">Відхилені</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Показувати по:</span>
          <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Автор</TableHead>
                <TableHead>Коментар</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{comment.authorName}</div>
                      <div className="text-xs text-muted-foreground">{comment.authorEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md break-words">{comment.content}</div>
                  </TableCell>
                  <TableCell>{format(new Date(comment.createdAt), "PPP", { locale: uk })}</TableCell>
                  <TableCell>
                    {comment.status === "pending" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Очікує схвалення
                      </Badge>
                    )}
                    {comment.status === "approved" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Схвалено
                      </Badge>
                    )}
                    {comment.status === "rejected" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Відхилено
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {comment.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            disabled={isProcessing === comment.id}
                          >
                            {isProcessing === comment.id ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckIcon className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(comment.id)}
                            disabled={isProcessing === comment.id}
                          >
                            {isProcessing === comment.id ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <XIcon className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setCommentToDelete(comment.id)}>
                        <AlertTriangleIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/50">
          <MessageSquareIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Немає коментарів</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {status === "all"
              ? "До цієї новини ще не додано жодного коментаря."
              : status === "pending"
                ? "Немає коментарів, які очікують на схвалення."
                : status === "approved"
                  ? "Немає схвалених коментарів."
                  : "Немає відхилених коментарів."}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  page > 1 ? `/admin/news/${newsId}/comments?status=${status}&page=${page - 1}&perPage=${perPage}` : "#"
                }
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/admin/news/${newsId}/comments?status=${status}&page=${i + 1}&perPage=${perPage}`}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `/admin/news/${newsId}/comments?status=${status}&page=${page + 1}&perPage=${perPage}`
                    : "#"
                }
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія не може бути скасована. Коментар буде назавжди видалений з нашої бази даних.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Видалення..." : "Видалити"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

