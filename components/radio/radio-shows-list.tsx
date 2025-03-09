"use client"

import { useState, useEffect } from "react"
import { getRadioShows } from "@/lib/services/radio-service"
import type { RadioShow } from "@/types/radio.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RadioShowsListProps {
  className?: string
  limit?: number
}

export function RadioShowsList({ className, limit }: RadioShowsListProps) {
  const [shows, setShows] = useState<RadioShow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true)
      try {
        const data = await getRadioShows()
        setShows(limit ? data.slice(0, limit) : data)
      } catch (error) {
        console.error("Error fetching radio shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [limit])

  const formatDays = (days: number[]) => {
    const dayNames = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    return days.map((day) => dayNames[day]).join(", ")
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Наші програми</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Немає доступних програм</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shows.map((show) => (
              <Link key={show.id} href={`/radio/shows/${show.id}`} className="block group">
                <div className="flex items-start gap-3 p-3 rounded-lg border group-hover:border-primary transition-colors">
                  <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    {show.imageUrl ? (
                      <Image src={show.imageUrl || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Calendar className="text-muted-foreground" size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">{show.title}</h3>

                    {show.host && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <User size={14} />
                        <span>{show.host}</span>
                      </div>
                    )}

                    {show.schedule && show.schedule.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDays(show.schedule[0].days)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          <span>
                            {show.schedule[0].startTime} - {show.schedule[0].endTime}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

