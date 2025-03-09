"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getRecentContent } from "@/lib/supabase/api"
import { Loader2 } from "lucide-react"

interface ContentItem {
  id: string
  title: string
  type: string
  updatedAt: string
  author: string
}

export function RecentContent() {
  const router = useRouter()
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getRecentContent(5)
        setContent(data)
      } catch (error) {
        console.error("Помилка при завантаженні останніх змін:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getEditLink = (item: ContentItem) => {
    switch (item.type) {
      case "news":
        return `/admin/news/edit/${item.id}`
      case "music":
        return `/admin/music/edit/${item.id}`
      case "program":
        return `/admin/programs/edit/${item.id}`
      case "artist":
        return `/admin/artists/edit/${item.id}`
      default:
        return "/admin"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Останні зміни контенту</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Немає останніх змін</div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    <span className="capitalize">
                      {item.type === "news"
                        ? "Новина"
                        : item.type === "music"
                          ? "Музика"
                          : item.type === "program"
                            ? "Програма"
                            : "Виконавець"}
                    </span>{" "}
                    • {formatDate(item.updatedAt)} • {item.author}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(getEditLink(item))}>
                  Редагувати
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

