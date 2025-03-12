"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getNewsByDate } from "../../../../lib/supabase"
import type { News } from "../../../../types/supabase"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import { PlusCircle, ArrowLeft } from "lucide-react"

export default function DailyNewsPage({ params }: { params: { date: string } }) {
  const [news, setNews] = useState<News[]>([])
  const date = parseISO(params.date)
  const formattedDate = format(date, "d MMMM yyyy", { locale: uk })

  useEffect(() => {
    fetchNews()
  }, [params.date])

  const fetchNews = async () => {
    try {
      const dailyNews = await getNewsByDate(params.date)
      setNews(dailyNews)
    } catch (error) {
      console.error("Error fetching news:", error)
    }
  }

  return (
    <>
      <AdminPageHeader
        title={`Новини за ${formattedDate}`}
        breadcrumbs={[{ label: "Адмінпанель", href: "/admin" }, { label: "Новини за датою" }]}
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/edit/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Додати новину
              </Link>
            </Button>
          </div>
        }
      />

      <AdminCard>
        {news.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {news.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{format(new Date(item.created_at), "HH:mm")}</p>
                    <h3 className="font-medium text-gray-800 mt-1">{item.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{item.content}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/news/${item.id}`}>Переглянути</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/edit/${item.id}`}>Редагувати</Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Немає новин за цей день</p>
            <Button asChild>
              <Link href="/admin/edit/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Додати новину
              </Link>
            </Button>
          </div>
        )}
      </AdminCard>
    </>
  )
}

