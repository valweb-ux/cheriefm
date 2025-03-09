import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getNewsById } from "@/lib/services/news-service"
import { getNewsVersions } from "@/lib/services/version-service"
import VersionHistory from "@/components/admin/news/version-history"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoryPageProps {
  params: {
    id: string
  }
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const newsId = params.id

  try {
    const news = await getNewsById(newsId)
    const versions = await getNewsVersions(newsId)

    if (!news) {
      notFound()
    }

    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Історія змін новини</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-2">{news.title}</h2>
            <p className="text-muted-foreground line-clamp-2">{news.description}</p>
          </div>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <VersionHistory versions={versions} newsId={newsId} currentVersion={news} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading news history:", error)
    return (
      <div className="container py-6">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
          Помилка завантаження історії змін. Спробуйте пізніше.
        </div>
      </div>
    )
  }
}

