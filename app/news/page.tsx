export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Новини | Chérie FM",
  description: "Останні новини та події від Chérie FM",
}

export default async function NewsPage() {
  const supabase = createClient()

  // Отримуємо новини з бази даних
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні новин" } }))

  if (error) {
    console.error("Error fetching news:", error)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Новини</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news && news.length > 0 ? (
          news.map((item) => (
            <Link href={`/news/${item.id}`} key={item.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={item.image || "/placeholder.svg?height=300&width=500"}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  {item.category && <p className="text-sm text-muted-foreground mt-1">{item.category}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(item.published_at || "").toLocaleDateString()}
                  </p>
                  {item.excerpt && <p className="text-sm mt-2 line-clamp-2">{item.excerpt}</p>}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">Немає новин</div>
        )}
      </div>
    </main>
  )
}

