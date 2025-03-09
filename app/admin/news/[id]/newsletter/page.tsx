import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getNewsById } from "@/lib/services/news-service"
import { getNewsletters } from "@/lib/services/newsletter-service"
import NewsletterForm from "@/components/admin/news/newsletter-form"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsletterPageProps {
  params: {
    id: string
  }
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  const newsId = params.id

  try {
    const news = await getNewsById(newsId)
    const newsletters = await getNewsletters()

    if (!news) {
      notFound()
    }

    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Розсилка новини підписникам</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-2">{news.title}</h2>
            <p className="text-muted-foreground line-clamp-2">{news.description}</p>
          </div>

          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <NewsletterForm news={news} newsletters={newsletters} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading news for newsletter:", error)
    return (
      <div className="container py-6">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
          Помилка завантаження новини. Спробуйте пізніше.
        </div>
      </div>
    )
  }
}

