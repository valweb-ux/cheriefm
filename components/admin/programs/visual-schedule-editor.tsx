"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Edit, Trash2, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { format, addMinutes, parseISO, isValid } from "date-fns"
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface Program {
  id: string
  title: string
  duration: number
  color?: string
}

interface ScheduleItem {
  id: string
  programId: string
  title: string
  startTime: string
  endTime: string
  isSpecial: boolean
  hosts?: string[]
  color?: string
}

interface ScheduleTemplate {
  id: string
  name: string
  dayOfWeek: number
  items: ScheduleItem[]
}

interface Host {
  id: string
  name: string
}

// Компонент для перетягуваного елемента програми
function DraggableProgramItem({ program }: { program: Program }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: program.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 mb-2 bg-background border rounded-md cursor-move hover:border-primary"
    >
      <div className="flex items-center">
        <div className="w-3 h-10 rounded-sm mr-2" style={{ backgroundColor: program.color || "#3182ce" }} />
        <div>
          <div className="font-medium">{program.title}</div>
          <div className="text-xs text-muted-foreground">{program.duration} хв</div>
        </div>
      </div>
    </div>
  )
}

// Компонент для елемента розкладу
function ScheduleItemComponent({
  item,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  item: ScheduleItem
  onEdit: (item: ScheduleItem) => void
  onDelete: (id: string) => void
  onDuplicate: (item: ScheduleItem) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-3 mb-2 border rounded-md cursor-move group relative",
        item.isSpecial ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" : "border-gray-200 bg-background",
      )}
    >
      <div className="flex items-center">
        <div className="w-3 h-14 rounded-sm mr-3" style={{ backgroundColor: item.color || "#3182ce" }} />
        <div className="flex-1">
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-muted-foreground">
            {format(parseISO(item.startTime), "HH:mm")} - {format(parseISO(item.endTime), "HH:mm")}
          </div>
          {item.isSpecial && (
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">Спеціальний ефір</div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDuplicate(item)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function VisualScheduleEditor() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [hosts, setHosts] = useState<Host[]>([])
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([])
  const [selectedDay, setSelectedDay] = useState<string>("1") // Понеділок за замовчуванням
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  // Сенсори для DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Завантаження програм
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
            duration: program.duration,
            color: program.color || "#3182ce",
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

  // Завантаження ведучих
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

  // Завантаження шаблонів розкладу
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/admin/schedule/templates")

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error("Помилка при завантаженні шаблонів:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити шаблони розкладу",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // Завантаження розкладу для вибраного дня
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true)
      try {
        // Формуємо дату для запиту
        const date = selectedDate

        const response = await fetch(`/api/admin/schedule/day?date=${date}`)

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()

        // Перетворюємо дані у формат для редактора
        const formattedItems = data.map((item: any) => ({
          id: item.id,
          programId: item.program_id,
          title: item.override_title || item.program_title,
          startTime: item.start_time,
          endTime: item.end_time,
          isSpecial: item.is_special,
          hosts: item.hosts,
          color: item.color || "#3182ce",
        }))

        setScheduleItems(formattedItems)
      } catch (error) {
        console.error("Помилка при завантаженні розкладу:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити розклад",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (selectedDate) {
      fetchSchedule()
    }
  }, [selectedDate])

  // Обробник перетягування програми з бібліотеки в розклад
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Якщо перетягуємо програму з бібліотеки в розклад
    if (active.id !== over.id) {
      const program = programs.find((p) => p.id === active.id)

      if (program) {
        // Визначаємо час початку нової програми
        let startTime

        if (scheduleItems.length === 0) {
          // Якщо розклад порожній, починаємо з 6:00 ранку
          const baseDate = new Date(selectedDate)
          baseDate.setHours(6, 0, 0, 0)
          startTime = baseDate.toISOString()
        } else {
          // Інакше починаємо після останньої програми
          const lastItem = scheduleItems[scheduleItems.length - 1]
          startTime = lastItem.endTime
        }

        // Обчислюємо час закінчення
        const endTime = addMinutes(new Date(startTime), program.duration).toISOString()

        // Створюємо новий елемент розкладу
        const newItem: ScheduleItem = {
          id: `temp-${Date.now()}`,
          programId: program.id,
          title: program.title,
          startTime,
          endTime,
          isSpecial: false,
          color: program.color,
        }

        // Додаємо до розкладу
        setScheduleItems([...scheduleItems, newItem])
      }
    }
  }

  // Обробник зміни порядку елементів розкладу
  const handleScheduleReorder = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setScheduleItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      // Створюємо новий масив з новим порядком
      const newItems = [...items]
      const [removed] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, removed)

      // Перераховуємо час початку і закінчення для всіх елементів
      return newItems.map((item, index) => {
        if (index === 0) {
          // Перший елемент - зберігаємо його час початку
          const endTime = addMinutes(
            new Date(item.startTime),
            getDurationMinutes(item.startTime, item.endTime),
          ).toISOString()

          return { ...item, endTime }
        } else {
          // Наступні елементи - починаються після попереднього
          const prevItem = newItems[index - 1]
          const startTime = prevItem.endTime
          const endTime = addMinutes(
            new Date(startTime),
            getDurationMinutes(item.startTime, item.endTime),
          ).toISOString()

          return { ...item, startTime, endTime }
        }
      })
    })
  }

  // Функція для обчислення тривалості в хвилинах
  const getDurationMinutes = (start: string, end: string): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000)
  }

  // Обробник редагування елемента розкладу
  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  // Обробник видалення елемента розкладу
  const handleDeleteItem = (id: string) => {
    setScheduleItems((items) => items.filter((item) => item.id !== id))
  }

  // Обробник дублювання елемента розкладу
  const handleDuplicateItem = (item: ScheduleItem) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `temp-${Date.now()}`,
      startTime: item.endTime,
      endTime: addMinutes(new Date(item.endTime), getDurationMinutes(item.startTime, item.endTime)).toISOString(),
    }

    setScheduleItems([...scheduleItems, newItem])
  }

  // Обробник збереження відредагованого елемента
  const handleSaveEditedItem = (editedItem: ScheduleItem) => {
    setScheduleItems((items) => items.map((item) => (item.id === editedItem.id ? editedItem : item)))
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  // Обробник збереження розкладу
  const handleSaveSchedule = async () => {
    setSaving(true)
    try {
      // Перевіряємо, чи є елементи для збереження
      if (scheduleItems.length === 0) {
        throw new Error("Розклад порожній")
      }

      // Перетворюємо елементи розкладу у формат для API
      const scheduleData = scheduleItems.map((item) => ({
        id: item.id.startsWith("temp-") ? undefined : item.id,
        program_id: item.programId,
        start_time: item.startTime,
        end_time: item.endTime,
        is_special: item.isSpecial,
        override_title: item.title !== programs.find((p) => p.id === item.programId)?.title ? item.title : null,
        hosts: item.hosts || [],
        status: "scheduled",
      }))

      // Відправляємо дані на сервер
      const response = await fetch(`/api/admin/schedule/day?date=${selectedDate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      })

      if (!response.ok) {
        throw new Error(`Помилка збереження: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Розклад збережено",
        })

        // Оновлюємо розклад з сервера
        const updatedResponse = await fetch(`/api/admin/schedule/day?date=${selectedDate}`)
        const updatedData = await updatedResponse.json()

        // Оновлюємо стан
        const formattedItems = updatedData.map((item: any) => ({
          id: item.id,
          programId: item.program_id,
          title: item.override_title || item.program_title,
          startTime: item.start_time,
          endTime: item.end_time,
          isSpecial: item.is_special,
          hosts: item.hosts,
          color: item.color || "#3182ce",
        }))

        setScheduleItems(formattedItems)
      } else {
        throw new Error(result.message || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні розкладу:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти розклад",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Обробник збереження шаблону
  const handleSaveTemplate = async () => {
    try {
      if (!templateName.trim()) {
        throw new Error("Введіть назву шаблону")
      }

      if (scheduleItems.length === 0) {
        throw new Error("Розклад порожній")
      }

      // Створюємо об'єкт шаблону
      const template: ScheduleTemplate = {
        id: `template-${Date.now()}`,
        name: templateName,
        dayOfWeek: Number.parseInt(selectedDay),
        items: scheduleItems,
      }

      // Відправляємо на сервер
      const response = await fetch("/api/admin/schedule/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error(`Помилка збереження: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Шаблон збережено",
        })

        // Оновлюємо список шаблонів
        const templatesResponse = await fetch("/api/admin/schedule/templates")
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData)

        // Закриваємо діалог
        setIsTemplateDialogOpen(false)
        setTemplateName("")
      } else {
        throw new Error(result.message || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні шаблону:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти шаблон",
        variant: "destructive",
      })
    }
  }

  // Обробник застосування шаблону
  const handleApplyTemplate = () => {
    const template = templates.find((t) => t.id === selectedTemplate)

    if (!template) {
      toast({
        title: "Помилка",
        description: "Шаблон не знайдено",
        variant: "destructive",
      })
      return
    }

    // Застосовуємо шаблон до поточного дня
    const baseDate = new Date(selectedDate)

    // Перетворюємо елементи шаблону в елементи розкладу
    const newItems = template.items.map((item) => {
      // Отримуємо час з елемента шаблону
      const startTime = new Date(item.startTime)
      const endTime = new Date(item.endTime)

      // Створюємо нові дати з поточним днем
      const newStartTime = new Date(baseDate)
      newStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)

      const newEndTime = new Date(baseDate)
      newEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0)

      return {
        ...item,
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        startTime: newStartTime.toISOString(),
        endTime: newEndTime.toISOString(),
      }
    })

    // Оновлюємо розклад
    setScheduleItems(newItems)

    toast({
      title: "Шаблон застосовано",
      description: `Застосовано шаблон "${template.name}"`,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <Label htmlFor="date-select">Дата</Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="w-full sm:w-auto">
            <Label htmlFor="template-select">Шаблон</Label>
            <div className="flex mt-1 gap-2">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger id="template-select" className="w-[200px]">
                  <SelectValue placeholder="Виберіть шаблон" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleApplyTemplate} disabled={!selectedTemplate}>
                Застосувати
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Зберегти як шаблон</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Зберегти як шаблон</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Назва шаблону</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Наприклад: Будні дні"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day-of-week">День тижня</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger id="day-of-week">
                      <SelectValue placeholder="Виберіть день тижня" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Понеділок</SelectItem>
                      <SelectItem value="2">Вівторок</SelectItem>
                      <SelectItem value="3">Середа</SelectItem>
                      <SelectItem value="4">Четвер</SelectItem>
                      <SelectItem value="5">П'ятниця</SelectItem>
                      <SelectItem value="6">Субота</SelectItem>
                      <SelectItem value="0">Неділя</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveTemplate}>Зберегти шаблон</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSaveSchedule} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Зберегти розклад
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Програми</h3>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {programs.map((program) => (
                    <DraggableProgramItem key={program.id} program={program} />
                  ))}
                </div>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Розклад ефіру</h3>
              <DndContext sensors={sensors} onDragEnd={handleScheduleReorder} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={scheduleItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[200px]">
                    {scheduleItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        Перетягніть програми сюди, щоб створити розклад
                      </div>
                    ) : (
                      scheduleItems.map((item) => (
                        <ScheduleItemComponent
                          key={item.id}
                          item={item}
                          onEdit={handleEditItem}
                          onDelete={handleDeleteItem}
                          onDuplicate={handleDuplicateItem}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Діалог редагування елемента розкладу */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редагування запису розкладу</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Назва</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-time">Час початку</Label>
                  <Input
                    id="edit-start-time"
                    type="datetime-local"
                    value={editingItem.startTime.slice(0, 16)}
                    onChange={(e) => {
                      if (isValid(parseISO(e.target.value))) {
                        setEditingItem({ ...editingItem, startTime: new Date(e.target.value).toISOString() })
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end-time">Час закінчення</Label>
                  <Input
                    id="edit-end-time"
                    type="datetime-local"
                    value={editingItem.endTime.slice(0, 16)}
                    onChange={(e) => {
                      if (isValid(parseISO(e.target.value))) {
                        setEditingItem({ ...editingItem, endTime: new Date(e.target.value).toISOString() })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is-special"
                  checked={editingItem.isSpecial}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isSpecial: checked as boolean })}
                />
                <Label htmlFor="edit-is-special">Спеціальний ефір</Label>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => handleSaveEditedItem(editingItem!)}>Зберегти зміни</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

