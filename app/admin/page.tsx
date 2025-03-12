"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getNews, getNewsByDate } from "../../lib/supabase"
import type { News } from "../../types/supabase"
import { DashboardWidget } from "@/components/admin/DashboardWidget"
import { ScheduledNewsWidget } from "@/components/admin/ScheduledNewsWidget"
import { NewsCalendar } from "@/components/NewsCalendar"
import { format } from "date-fns"

export default function AdminPage() {
  const [recentNews, setRecentNews] = useState<News[]>([])
  const [todayNews, setTodayNews] = useState<News[]>([])
  const [newsCount, setNewsCount] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const today = new Date()
  const formattedToday = format(today, "yyyy-MM-dd")

  useEffect(() => {
    fetchRecentNews()
    fetchTodayNews()
  }, [])

  const fetchRecentNews = async () => {
    try {
      const { news, total } = await getNews(1, 5)
      setRecentNews(news)
      setNewsCount(total)
    } catch (error) {
      console.error("Error fetching recent news:", error)
    }
  }

  const fetchTodayNews = async () => {
    try {
      const news = await getNewsByDate(formattedToday)
      setTodayNews(news)
    } catch (error) {
      console.error("Error fetching today's news:", error)
    }
  }

  const handleQuickDraft = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement quick draft saving logic
    alert("Чернетку збережено!")
    setTitle("")
    setContent("")
  }

  return (
    <div>
      <h1 className="admin-page-title">Головна панель</h1>

      <div className="dashboard-widgets">
        <DashboardWidget title="Огляд новин">
          <h3>Останні новини</h3>
          <ul className="activity-list">
            {recentNews.map((item) => (
              <li key={item.id} className="activity-item">
                <div className="activity-time">
                  {format(new Date(item.publish_date || item.created_at), "d MMMM yyyy")}
                </div>
                <div className="activity-title">
                  <Link href={`/admin/edit/${item.id}`} className="admin-link">
                    {item.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "12px" }}>
            <Link href="/admin" className="admin-link">
              Переглянути всі новини →
            </Link>
          </div>
        </DashboardWidget>

        <ScheduledNewsWidget />

        <DashboardWidget title="Швидка чернетка">
          <form className="quick-draft-form" onSubmit={handleQuickDraft}>
            <div>
              <label htmlFor="quick-draft-title" className="quick-draft-label">
                Заголовок
              </label>
              <input
                type="text"
                id="quick-draft-title"
                className="admin-form-input quick-draft-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="quick-draft-content" className="quick-draft-label">
                Зміст
              </label>
              <textarea
                id="quick-draft-content"
                className="admin-form-textarea quick-draft-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Що у вас на думці?"
                required
              ></textarea>
            </div>
            <div className="quick-draft-actions">
              <button type="submit" className="admin-button admin-button-primary">
                Зберегти чернетку
              </button>
            </div>
          </form>
        </DashboardWidget>

        <DashboardWidget title="Календар новин">
          <NewsCalendar />
          {todayNews.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <Link href={`/admin/news/${formattedToday}`} className="admin-link">
                Переглянути новини за сьогодні ({todayNews.length}) →
              </Link>
            </div>
          )}
        </DashboardWidget>

        <DashboardWidget title="Загальний огляд">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "400", color: "#1d2327" }}>{newsCount}</div>
              <div>Новин</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "400", color: "#1d2327" }}>5</div>
              <div>Радіостанцій</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "400", color: "#1d2327" }}>1</div>
              <div>Користувач</div>
            </div>
          </div>
        </DashboardWidget>

        <DashboardWidget title="Активність">
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-badge activity-badge-new">НОВЕ</span>
              <Link href="#" className="admin-link">
                CherieFM v1.0 випущено
              </Link>
              <div className="activity-time">12 березня 2025</div>
            </li>
            <li className="activity-item">
              <span className="activity-badge">ОНОВЛЕННЯ</span>
              <Link href="#" className="admin-link">
                Покращено функціональність радіоплеєра
              </Link>
              <div className="activity-time">10 березня 2025</div>
            </li>
            <li className="activity-item">
              <span className="activity-badge">ОНОВЛЕННЯ</span>
              <Link href="#" className="admin-link">
                Впроваджено систему новин
              </Link>
              <div className="activity-time">5 березня 2025</div>
            </li>
          </ul>
        </DashboardWidget>
      </div>
    </div>
  )
}

