"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface ScheduleEntryFormProps {
  id?: string
}

interface Program {
  id: string
  title: string
}

interface Host {
  id: string
  name: string
}

interface ScheduleEntryData {
  program_id: string
  start_time: string
  end_time: string
  is_recurring: boolean
  recurrence_rule: string
  hosts: string[]
  notes: string
  is_special: boolean
  override_title: string
  status: "scheduled" | "live" | "completed" | "cancelled"
}

export function ScheduleEntryForm({ id }: ScheduleEntryFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [hosts, setHosts] = useState<Host[]>([])

  // Отримуємо параметри з URL, якщо вони є
  const startParam = searchParams?.get("start")
  const endParam = searchParams?.get("end")

  const [formData, setFormData] = useState<ScheduleEntryData>({
    program_id: "",
    start_time: startParam || new Date().toISOString().slice(0, 16),
    end_time: endParam || new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    is_recurring: false,
    recurrence_rule: "",
    hosts: [],
    notes: "",
    is_special: false,
    override_title: "",
    status: "scheduled",
  })

  // Завантажуємо список програм
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/admin/programs?limit=100")

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()
        setPrograms(
          data.data.map((program: any) => ({
            id: program.id,
            title: program.title_uk,
          })),
        )
      } catch (error) {
        console.error("Помилка при завантаженні програм:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити список програм",
          variant: "destructive",
        })
      }
    }

    fetchPrograms()
  }, [])

  // Завантажуємо список ведучих
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch("/api/admin/hosts?limit=100")

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()
        setHosts(
          data.data.map((host: any) => ({
            id: host.id,
            name: host.name,
          })),
        )
      } catch (error) {
        console.error("Помилка при завантаженні ведучих:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити список ведучих",
          variant: "destructive",
        })
      }
    }

    fetchHosts()
  }, [])

  // Завантажуємо дані запису розкладу, якщо це редагування
  useEffect(() => {
    if (id) {
      const fetchScheduleEntry = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/admin/schedule/${id}`)

          if (!response.ok) {
            throw new Error(`Помилка завантаження: ${response.status}`)
          }

          const entryData = await response.json()

          // Форматуємо дані для форми
          setFormData({
            program_id: entryData.program_id,
            start_time: new Date(entryData.start_time).toISOString().slice(0, 16),
            end_time: new Date(entryData.end_time).toISOString().slice(0, 16),
            is_recurring: entryData.is_recurring,
            recurrence_rule: entryData.recurrence_rule || "",
            hosts: entryData.hosts || [],
            notes: entryData.notes || "",
            is_special: entryData.is_special,
            override_title: entryData.override_title || "",
            status: entryData.status,
          })
        } catch (error) {
          console.error("Помилка при завантаженні запису розкладу:", error)
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити дані запису розкладу",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchScheduleEntry()
    }
  }, [id])

  const handleChange = (field: keyof ScheduleEntryData, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHostToggle = (hostId: string) => {
    setFormData((prev) => {
      const hosts = [...prev.hosts]

      if (hosts.includes(hostId)) {
        return {
          ...prev,
          hosts: hosts.filter((id) => id !== hostId),
        }
      } else {
        return {
          ...prev,
          hosts: [...hosts, hostId],
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Перевіряємо обов'язкові поля
      if (!formData.program_id) {
        throw new Error("Виберіть програму")
      }

      if (!formData.start_time || !formData.end_time) {
        throw new Error("Вкажіть час початку та закінчення")
      }

      // Перевіряємо, що кінцевий час пізніше початкового
      if (new Date(formData.end_time) <= new Date(formData.start_time)) {
        throw new Error("Кінцевий час має бути пізніше початкового")
      }

      // Створюємо FormData для відправки
      const submitData = new FormData()
      submitData.append("program_id", formData.program_id)
      submitData.append("start_time", formData.start_time)
      submitData.append("end_time", formData.end_time)
      submitData.append("is_recurring", formData.is_recurring ? "on" : "off")
      submitData.append("recurrence_rule", formData.recurrence_rule)
      formData.hosts.forEach((hostId) => {
        submitData.append("hosts", hostId)
      })
      submitData.append("notes", formData.notes)
      submitData.append("is_special", formData.is_special ? "on" : "off")
      submitData.append("override_title", formData.override_title)
      submitData.append("status", formData.status)

      // Відправляємо дані
      let response
      if (id) {
        // Оновлюємо існуючий запис
        response = await fetch(`/api/admin/schedule/${id}`, {
          method: "PUT",
          body: submitData,
        })
      } else {
        // Створюємо новий запис
        response = await fetch("/api/admin/schedule", {
          method: "POST",
          body: submitData,
        })
      }

      if (!response.ok) {
        throw new Error(`Помилка збереження: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: id ? "Запис розкладу оновлено" : "Запис розкладу створено",
        })
        router.push("/admin/schedule")
      } else {
        throw new Error(result.message || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні запису розкладу:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти запис розкладу",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program_id">Програма</Label>
                <Select value={formData.program_id} onValueChange={(value) => handleChange("program_id", value)}>
                  <SelectTrigger id="program_id">
                    <SelectValue placeholder="Виберіть програму" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Час початку</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => handleChange("start_time", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Час закінчення</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => handleChange("end_time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_recurring"
                    checked={formData.is_recurring}
                    onCheckedChange={(checked) => handleChange("is_recurring", checked)}
                  />
                  <Label htmlFor="is_recurring">Повторюваний запис</Label>
                </div>
              </div>

              {formData.is_recurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurrence_rule">Правило повторення</Label>
                  <Select
                    value={formData.recurrence_rule}
                    onValueChange={(value) => handleChange("recurrence_rule", value)}
                  >
                    <SelectTrigger id="recurrence_rule">
                      <SelectValue placeholder="Виберіть правило повторення" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREQ=DAILY">Щодня</SelectItem>
                      <SelectItem value="FREQ=WEEKLY">Щотижня</SelectItem>
                      <SelectItem value="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR">Будні дні</SelectItem>
                      <SelectItem value="FREQ=WEEKLY;BYDAY=SA,SU">Вихідні</SelectItem>
                      <SelectItem value="FREQ=MONTHLY">Щомісяця</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Ведучі</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {hosts.map((host) => (
                    <div key={host.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`host-${host.id}`}
                        checked={formData.hosts.includes(host.id)}
                        onCheckedChange={() => handleHostToggle(host.id)}
                      />
                      <Label htmlFor={`host-${host.id}`}>{host.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="override_title">Спеціальна назва (необов'язково)</Label>
                <Input
                  id="override_title"
                  value={formData.override_title}
                  onChange={(e) => handleChange("override_title", e.target.value)}
                  placeholder="Залиште порожнім, щоб використовувати назву програми"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Примітки</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "scheduled" | "live" | "completed" | "cancelled") =>
                      handleChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Виберіть статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Заплановано</SelectItem>
                      <SelectItem value="live">В ефірі</SelectItem>
                      <SelectItem value="completed">Завершено</SelectItem>
                      <SelectItem value="cancelled">Скасовано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_special"
                    checked={formData.is_special}
                    onCheckedChange={(checked) => handleChange("is_special", checked)}
                  />
                  <Label htmlFor="is_special">Спеціальний випуск</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/schedule")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до розкладу
          </Button>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Зберегти
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

