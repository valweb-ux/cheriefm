"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/uk"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Локалізація календаря
moment.locale("uk")
const localizer = momentLocalizer(moment)

interface ScheduleEvent {
  id: string
  title: string
  start: Date
  end: Date
  programId: string
  isSpecial: boolean
  status: string
  resourceId?: string
}

export function ScheduleCalendar() {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("week")
  const [date, setDate] = useState(new Date())

  // Завантаження даних розкладу
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        // Визначаємо діапазон дат для запиту
        let startDate, endDate

        if (view === "month") {
          startDate = moment(date).startOf("month").format("YYYY-MM-DD")
          endDate = moment(date).endOf("month").format("YYYY-MM-DD")
        } else if (view === "week") {
          startDate = moment(date).startOf("week").format("YYYY-MM-DD")
          endDate = moment(date).endOf("week").format("YYYY-MM-DD")
        } else if (view === "day") {
          startDate = moment(date).format("YYYY-MM-DD")
          endDate = moment(date).format("YYYY-MM-DD")
        } else {
          startDate = moment(date).subtract(30, "days").format("YYYY-MM-DD")
          endDate = moment(date).add(30, "days").format("YYYY-MM-DD")
        }

        const response = await fetch(`/api/admin/schedule?start=${startDate}&end=${endDate}`)

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()

        // Перетворюємо дані у формат для календаря
        const formattedEvents = data.map((entry: any) => ({
          id: entry.id,
          title: entry.override_title || entry.program_title || "Програма",
          start: new Date(entry.start_time),
          end: new Date(entry.end_time),
          programId: entry.program_id,
          isSpecial: entry.is_special,
          status: entry.status,
          resourceId: entry.hosts && entry.hosts.length > 0 ? entry.hosts[0] : undefined,
        }))

        setEvents(formattedEvents)
      } catch (error) {
        console.error("Помилка при завантаженні розкладу:", error)
        toast({
          title: "Помилка",
          description: error instanceof Error ? error.message : "Не вдалося завантажити розклад",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [view, date])

  // Обробники подій календаря
  const handleSelectEvent = (event: ScheduleEvent) => {
    router.push(`/admin/schedule/${event.id}`)
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Перенаправляємо на сторінку створення запису з попередньо заповненими датами
    const startTime = moment(start).format("YYYY-MM-DDTHH:mm")
    const endTime = moment(end).format("YYYY-MM-DDTHH:mm")
    router.push(`/admin/schedule/create?start=${startTime}&end=${endTime}`)
  }

  // Стилізація подій
  const eventStyleGetter = (event: ScheduleEvent) => {
    let backgroundColor = "#3182ce" // default blue

    if (event.status === "cancelled") {
      backgroundColor = "#e53e3e" // red for cancelled
    } else if (event.status === "live") {
      backgroundColor = "#38a169" // green for live
    } else if (event.isSpecial) {
      backgroundColor = "#805ad5" // purple for special
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0",
        display: "block",
      },
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-[700px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day", "agenda"]}
            defaultView="week"
            view={view}
            date={date}
            onView={(newView: any) => setView(newView)}
            onNavigate={(newDate: Date) => setDate(newDate)}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            messages={{
              today: "Сьогодні",
              previous: "Назад",
              next: "Вперед",
              month: "Місяць",
              week: "Тиждень",
              day: "День",
              agenda: "Список",
              date: "Дата",
              time: "Час",
              event: "Подія",
              allDay: "Весь день",
              noEventsInRange: "Немає програм у вибраному діапазоні",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

