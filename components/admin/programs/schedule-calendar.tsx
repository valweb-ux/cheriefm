"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

// Замінюємо react-big-calendar та moment на просту реалізацію календаря

interface ScheduleEvent {
  id: string
  title: string
  start: Date
  end: Date
  programId: string
}

interface ScheduleCalendarProps {
  events: ScheduleEvent[]
  onEventSelect: (event: ScheduleEvent) => void
  onAddEvent: (date: Date) => void
}

export default function ScheduleCalendar({ events, onEventSelect, onAddEvent }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"day" | "week">("week")

  // Отримуємо початок тижня (понеділок)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Корегуємо для неділі
    return new Date(d.setDate(diff))
  }

  // Отримуємо дні тижня
  const getWeekDays = (startDate: Date) => {
    const days = []
    const currentDay = new Date(startDate)

    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  // Отримуємо години дня
  const getHours = () => {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    return hours
  }

  // Форматуємо дату
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "short" })
  }

  // Форматуємо час
  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  // Перевіряємо, чи є подія в цей час
  const getEventsForHourAndDay = (hour: number, date: Date) => {
    const dayStart = new Date(date)
    dayStart.setHours(hour, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(hour + 1, 0, 0, 0)

    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      return (
        (eventStart >= dayStart && eventStart < dayEnd) ||
        (eventEnd > dayStart && eventEnd <= dayEnd) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      )
    })
  }

  // Переходимо до попереднього періоду
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  // Переходимо до наступного періоду
  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  // Переходимо до сьогодні
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const weekStart = getWeekStart(currentDate)
  const weekDays = getWeekDays(weekStart)
  const hours = getHours()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToPrevious}>
            &lt;
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Сьогодні
          </Button>
          <Button variant="outline" onClick={goToNext}>
            &gt;
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            {currentView === "day" ? formatDate(currentDate) : `${formatDate(weekStart)} - ${formatDate(weekDays[6])}`}
          </h2>
        </div>

        <Select value={currentView} onValueChange={(value) => setCurrentView(value as "day" | "week")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Вигляд" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">День</SelectItem>
            <SelectItem value="week">Тиждень</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-auto max-h-[600px]">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[60px_1fr] border-b">
            <div className="p-2 border-r"></div>
            <div className={`grid ${currentView === "day" ? "grid-cols-1" : "grid-cols-7"}`}>
              {currentView === "day" ? (
                <div className="p-2 text-center font-medium border-r last:border-r-0">{formatDate(currentDate)}</div>
              ) : (
                weekDays.map((day, index) => (
                  <div key={index} className="p-2 text-center font-medium border-r last:border-r-0">
                    {formatDate(day)}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-[60px_1fr]">
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-20 p-2 text-xs text-right border-b last:border-b-0">
                  {formatTime(hour)}
                </div>
              ))}
            </div>

            <div className={`grid ${currentView === "day" ? "grid-cols-1" : "grid-cols-7"}`}>
              {currentView === "day" ? (
                <div className="border-r last:border-r-0">
                  {hours.map((hour) => {
                    const eventsForHour = getEventsForHourAndDay(hour, currentDate)

                    return (
                      <div
                        key={hour}
                        className="h-20 p-1 border-b last:border-b-0 relative"
                        onClick={() => {
                          const date = new Date(currentDate)
                          date.setHours(hour, 0, 0, 0)
                          onAddEvent(date)
                        }}
                      >
                        {eventsForHour.map((event) => (
                          <div
                            key={event.id}
                            className="absolute bg-primary/20 border border-primary rounded p-1 text-xs cursor-pointer"
                            style={{
                              top: "4px",
                              left: "4px",
                              right: "4px",
                              height: "calc(100% - 8px)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventSelect(event)
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ) : (
                weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-r last:border-r-0">
                    {hours.map((hour) => {
                      const eventsForHour = getEventsForHourAndDay(hour, day)

                      return (
                        <div
                          key={hour}
                          className="h-20 p-1 border-b last:border-b-0 relative"
                          onClick={() => {
                            const date = new Date(day)
                            date.setHours(hour, 0, 0, 0)
                            onAddEvent(date)
                          }}
                        >
                          {eventsForHour.map((event) => (
                            <div
                              key={event.id}
                              className="absolute bg-primary/20 border border-primary rounded p-1 text-xs cursor-pointer"
                              style={{
                                top: "4px",
                                left: "4px",
                                right: "4px",
                                height: "calc(100% - 8px)",
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                onEventSelect(event)
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

