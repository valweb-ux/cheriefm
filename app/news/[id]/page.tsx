import { getNewsById } from "../../../lib/supabase"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const revalidate = 0

export default async function NewsPage({ params }: { params: { id: string } }) {
  const newsItem = await getNewsById(Number.parseInt(params.id))

  if (!newsItem) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-4">Новину не знайдено</h1>
        <Button asChild>
          <Link href="/">Повернутися на головну</Link>
        </Button>
      </Layout>
    )
  }

  console.log("Відображення новини:", newsItem)
  console.log("URL зображення:", newsItem.image_url)

  return (
    <Layout>
      <Card>
        {newsItem.image_url && (
          <div className="w-full h-[300px] overflow-hidden">
            <img
              src={newsItem.image_url || "/placeholder.svg"}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl">{newsItem.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Використовуємо dangerouslySetInnerHTML для відображення HTML-контенту */}
          <div className="mb-4 news-content" dangerouslySetInnerHTML={{ __html: newsItem.content }} />
          <p className="text-sm text-muted-foreground mb-4">
            Дата публікації: {new Date(newsItem.publish_date || newsItem.created_at).toLocaleString()}
          </p>
          <Button asChild>
            <Link href="/">Повернутися на головну</Link>
          </Button>
        </CardContent>
      </Card>
    </Layout>
  )
}

