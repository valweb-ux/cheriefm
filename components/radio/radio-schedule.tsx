"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getScheduleForDay } from "@/lib/services/radio-service"
import type { RadioSchedule } from "@/types/radio.types"
import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface RadioScheduleProps {
  className?: string
}

const DAYS = [
  { value: "0", label: "Нд" },
  { value: "1", label: "Пн" },
  { value: "2", label: "Вт" },
  { value: "3", label: "Ср" },
  { value: "4", label: "Чт" },
  { value: "5", label: "Пт" },
  { value: "6", label: "Сб" },
]

export function RadioSchedule({ className }: RadioScheduleProps) {
  const [currentDay, setCurrentDay] = useState<string>(new Date().getDay().toString())
  const [schedule, setSchedule] = useState<RadioSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProgram, setCurrentProgram] = useState<RadioSchedule | null>(null)

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        const data = await getScheduleForDay(Number.parseInt(currentDay))
        setSchedule(data)

        // Визначаємо поточну програму
        const now = new Date()
        const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        const current = data.find((program) => {
          return program.startTime <= currentTime && program.endTime > currentTime
        })

        setCurrentProgram(current || null)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [currentDay])

  const formatTime = (time: string) => {
    return time
  }

  const isCurrentProgram = (program: RadioSchedule) => {
    if (!currentProgram) return false
    return program.id === currentProgram.id
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Розклад ефіру</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentDay} onValueChange={setCurrentDay}>
          <TabsList className="grid grid-cols-7 w-full">
            {DAYS.map((day) => (
              <TabsTrigger key={day.value} value={day.value}>
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map((day) => (
            <TabsContent key={day.value} value={day.value} className="space-y-4 mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : schedule.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Немає програм на цей день</div>
              ) : (
                <div className="space-y-3">
                  {schedule.map((program) => (
                    <div
                      key={program.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        isCurrentProgram(program) && "bg-primary/5 border-primary",
                      )}
                    >
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        {program.imageUrl ? (
                          <Image
                            src={program.imageUrl || "/placeholder.svg"}
                            alt={program.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Calendar className="text-muted-foreground" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium truncate">{program.title}</h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock size={14} />
                          <span>
                            {formatTime(program.startTime)} - {formatTime(program.endTime)}
                          </span>
                        </div>

                        {program.host && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <User size={14} />
                            <span>{program.host}</span>
                          </div>
                        )}
                      </div>

                      {isCurrentProgram(program) && (
                        <div className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                          Зараз в ефірі
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

