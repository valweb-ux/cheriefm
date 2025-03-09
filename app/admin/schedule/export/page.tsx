"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { exportScheduleToICalAction, exportScheduleToGoogleCalAction } from "../actions"
import { useToast } from "@/hooks/use-toast"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ExportSchedulePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [loading, setLoading] = useState<boolean>(false)

  const handleExportToICal = async () => {
    setLoading(true)
    try {
      const result = await exportScheduleToICalAction(startDate, endDate)

      if (result.success && result.data) {
        // Створюємо Blob з даними iCal
        const blob = new Blob([result.data], { type: "text/calendar" })

        // Створюємо URL для завантаження
        const url = URL.createObjectURL(blob)

        // Створюємо посилання для завантаження
        const a = document.createElement("a")
        a.href = url
        a.download = `cheriefm-schedule-${startDate}-${endDate}.ics`
        document.body.appendChild(a)
        a.click()

        // Очищаємо ресурси
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 0)

        toast({
          title: "Успішно",
          description: "Розклад успішно експортовано в iCalendar",
        })
      } else {
        throw new Error(result.message || "Помилка при експорті розкладу")
      }
    } catch (error) {
      console.error("Error exporting to iCal:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося експортувати розклад",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportToGoogleCalendar = async () => {
    setLoading(true)
    try {
      const result = await exportScheduleToGoogleCalAction(startDate, endDate)

      if (result.success && result.url) {
        // Відкриваємо URL в новому вікні
        window.open(result.url, "_blank")

        toast({
          title: "Успішно",
          description: "Розклад успішно експортовано в Google Calendar",
        })
      } else {
        throw new Error(result.message || "Помилка при експорті розкладу")
      }
    } catch (error) {
      console.error("Error exporting to Google Calendar:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося експортувати розклад",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Експорт розкладу</h1>
        <p className="text-muted-foreground">Експортуйте розклад ефіру в різні формати</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Налаштування експорту</CardTitle>
          <CardDescription>Виберіть період для експорту розкладу</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Початкова дата</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Кінцева дата</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/schedule")} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до розкладу
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={handleExportToICal} disabled={loading} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Експорт в iCalendar
            </Button>
            <Button onClick={handleExportToGoogleCalendar} disabled={loading} className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Експорт в Google Calendar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

