"use client"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import "react-day-picker/dist/style.css"
import Link from "next/link"
import { getNewsDates } from "@/lib/supabase"

export function NewsCalendar() {
  const today = new Date()
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [newsDates, setNewsDates] = useState<string[]>([])

  useEffect(() => {
    fetchNewsDates()
  }, [])

  const fetchNewsDates = async () => {
    try {
      const dates = await getNewsDates()
      setNewsDates(dates)
    } catch (error) {
      console.error("Error fetching news dates:", error)
    }
  }

  const isDayWithNews = (day: Date) => {
    return newsDates.includes(format(day, "yyyy-MM-dd"))
  }

  return (
    <div>
      <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        locale={uk}
        modifiers={{ hasNews: isDayWithNews }}
        modifiersStyles={{
          hasNews: { border: "2px solid blue" },
        }}
        defaultMonth={today}
        today={today}
      />
      {selectedDay && isDayWithNews(selectedDay) && (
        <Link
          href={`/admin/news/${format(selectedDay, "yyyy-MM-dd")}`}
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Переглянути новини за {format(selectedDay, "d MMMM yyyy", { locale: uk })}
        </Link>
      )}
    </div>
  )
}

