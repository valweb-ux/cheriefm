import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getNewsById } from "@/lib/services/news-service"
import { getCommentsByNewsId } from "@/lib/services/comment-service"
import CommentsTable from "@/components/admin/news/comments-table"
import { Skeleton } from "@/components/ui/skeleton"

interface CommentsPageProps {
  params: {
    id: string
  }
  searchParams: {
    status?: string
    page?: string
    perPage?: string
  }
}

export default async function CommentsPage({ params, searchParams }: CommentsPageProps) {
  const newsId = params.id
  const status = searchParams.status || "all"
  const page = Number.parseInt(searchParams.page || "1")
  const perPage = Number.parseInt(searchParams.perPage || "10")

  try {
    const news = await getNewsById(newsId)

    if (!news) {
      notFound()
    }

    const { comments, count } = await getCommentsByNewsId(
      newsId,
      perPage,
      (page - 1) * perPage,
      status !== "all" ? status : undefined,
    )

    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Коментарі до новини</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-2">{news.title}</h2>
            <p className="text-muted-foreground line-clamp-2">{news.description}</p>
          </div>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CommentsTable
              comments={comments}
              count={count}
              page={page}
              perPage={perPage}
              newsId={newsId}
              status={status}
            />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading comments:", error)
    return (
      <div className="container py-6">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
          Помилка завантаження коментарів. Спробуйте пізніше.
        </div>
      </div>
    )
  }
}

