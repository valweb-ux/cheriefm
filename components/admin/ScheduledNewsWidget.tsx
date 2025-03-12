"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getScheduledNews } from "@/lib/supabase"
import type { News } from "@/types/supabase"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { DashboardWidget } from "./DashboardWidget"

export function ScheduledNewsWidget() {
  const [scheduledNews, setScheduledNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchScheduledNews()
  }, [])

  const fetchScheduledNews = async () => {
    try {
      setIsLoading(true)
      const news = await getScheduledNews()
      setScheduledNews(news)
    } catch (error) {
      console.error("Error fetching scheduled news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardWidget title="Заплановані новини">
      {isLoading ? (
        <div>Завантаження...</div>
      ) : scheduledNews.length > 0 ? (
        <ul className="activity-list">
          {scheduledNews.map((item) => (
            <li key={item.id} className="activity-item">
              <div className="activity-time">
                Заплановано на:{" "}
                {format(new Date(item.publish_date || item.created_at), "d MMMM yyyy, HH:mm", { locale: uk })}
              </div>
              <div className="activity-title">
                <Link href={`/admin/edit/${item.id}`} className="admin-link">
                  {item.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-2">
          <p>Немає запланованих новин</p>
        </div>
      )}
    </DashboardWidget>
  )
}

