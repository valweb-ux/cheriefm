"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Music, Radio, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/supabase/api"

interface StatsItem {
  title: string
  value: number
  icon: React.ElementType
  description: string
}

export function Overview() {
  const [stats, setStats] = useState<StatsItem[]>([
    {
      title: "Новини",
      value: 0,
      icon: Newspaper,
      description: "Опубліковані новини",
    },
    {
      title: "Музика",
      value: 0,
      icon: Music,
      description: "Музичні треки",
    },
    {
      title: "Програми",
      value: 0,
      icon: Radio,
      description: "Радіо програми",
    },
    {
      title: "Виконавці",
      value: 0,
      icon: Users,
      description: "Виконавці",
    },
  ])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()

        setStats([
          {
            title: "Новини",
            value: data.news,
            icon: Newspaper,
            description: "Опубліковані новини",
          },
          {
            title: "Музика",
            value: data.music,
            icon: Music,
            description: "Музичні треки",
          },
          {
            title: "Програми",
            value: data.programs,
            icon: Radio,
            description: "Радіо програми",
          },
          {
            title: "Виконавці",
            value: data.artists,
            icon: Users,
            description: "Виконавці",
          },
        ])
      } catch (error) {
        console.error("Помилка при завантаженні статистики:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : item.value}
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

