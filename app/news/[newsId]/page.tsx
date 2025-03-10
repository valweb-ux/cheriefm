export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface NewsParams {
  params: { newsId: string }
}

export async function generateMetadata({ params }: NewsParams): Promise<Metadata> {
  const supabase = createClient()

  try {
    // Отримуємо новину з бази даних
    const { data: news } = await supabase
      .from("news")
      .select("*")
      .eq("id", params.newsId)
      .single()
      .catch(() => ({ data: null }))

    if (!news) {
      return {
        title: "Новина не знайдена",
      }
    }

    return {
      title: news.title,
      description: news.excerpt || news.content?.substring(0, 160),
    }
  } catch (error) {
    console.error(`Error generating metadata for news ${params.newsId}:`, error)
    return {
      title: "Chérie FM - Новини",
    }
  }
}

export default async function NewsDetailPage({ params }: NewsParams) {
  const supabase = createClient()

  try {
    // Отримуємо новину з бази даних
    const { data: news, error } = await supabase.from("news").select("*").eq("id", params.newsId).single()

    if (error || !news) {
      console.error(`Error fetching news with id ${params.newsId}:`, error)
      notFound()
    }

    return (
      <main className="container mx-auto py-8 px-4">
        <Link href="/news">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до всіх новин
          </Button>
        </Link>

        <article>
          <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {news.category && (
              <div className="flex items-center text-sm">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Категорія: {news.category}</span>
              </div>
            )}

            {news.published_at && (
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Опубліковано: {new Date(news.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {news.image && (
            <div className="mb-6">
              <img
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {news.excerpt && <div className="text-lg font-medium mb-6 text-muted-foreground">{news.excerpt}</div>}

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.content || "" }} />
        </article>
      </main>
    )
  } catch (error) {
    console.error(`Unexpected error in news ${params.newsId}:`, error)
    throw error // Це викличе відображення компонента error.tsx
  }
}

