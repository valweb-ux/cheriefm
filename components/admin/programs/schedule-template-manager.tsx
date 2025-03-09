"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Edit, Trash2, Copy } from "lucide-react"
import { format } from "date-fns"

interface ScheduleItem {
  id: string
  programId: string
  title: string
  startTime: string
  endTime: string
  isSpecial: boolean
  color?: string
}

interface ScheduleTemplate {
  id: string
  name: string
  dayOfWeek: number
  items: ScheduleItem[]
  created_at?: string
  updated_at?: string
}

const dayNames = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]

export function ScheduleTemplateManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [selectedDay, setSelectedDay] = useState<string>("1")

  // Завантаження шаблонів
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

  // Обробник видалення шаблону
  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch(`/api/admin/schedule/templates/${selectedTemplate.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Помилка видалення: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Шаблон видалено",
        })

        // Оновлюємо список шаблонів
        setTemplates(templates.filter((t) => t.id !== selectedTemplate.id))
        setSelectedTemplate(null)
        setIsDeleteDialogOpen(false)
      } else {
        throw new Error(result.message || "Помилка при видаленні")
      }
    } catch (error) {
      console.error("Помилка при видаленні шаблону:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося видалити шаблон",
        variant: "destructive",
      })
    }
  }

  // Обробник перейменування шаблону
  const handleRenameTemplate = async () => {
    if (!selectedTemplate || !newTemplateName.trim()) return

    try {
      const response = await fetch(`/api/admin/schedule/templates/${selectedTemplate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTemplateName,
          dayOfWeek: Number.parseInt(selectedDay),
        }),
      })

      if (!response.ok) {
        throw new Error(`Помилка оновлення: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Шаблон оновлено",
        })

        // Оновлюємо список шаблонів
        setTemplates(
          templates.map((t) =>
            t.id === selectedTemplate.id ? { ...t, name: newTemplateName, dayOfWeek: Number.parseInt(selectedDay) } : t,
          ),
        )
        setSelectedTemplate(null)
        setIsRenameDialogOpen(false)
        setNewTemplateName("")
      } else {
        throw new Error(result.message || "Помилка при оновленні")
      }
    } catch (error) {
      console.error("Помилка при оновленні шаблону:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося оновити шаблон",
        variant: "destructive",
      })
    }
  }

  // Обробник дублювання шаблону
  const handleDuplicateTemplate = async (template: ScheduleTemplate) => {
    try {
      const duplicatedTemplate = {
        ...template,
        id: undefined,
        name: `${template.name} (копія)`,
      }

      const response = await fetch("/api/admin/schedule/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedTemplate),
      })

      if (!response.ok) {
        throw new Error(`Помилка дублювання: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Шаблон дубльовано",
        })

        // Оновлюємо список шаблонів
        const templatesResponse = await fetch("/api/admin/schedule/templates")
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData)
      } else {
        throw new Error(result.message || "Помилка при дублюванні")
      }
    } catch (error) {
      console.error("Помилка при дублюванні шаблону:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося дублювати шаблон",
        variant: "destructive",
      })
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>День тижня: {dayNames[template.dayOfWeek]}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">{template.items.length} програм у розкладі</div>

                <div className="text-sm">
                  {template.items.length > 0 && (
                    <>
                      <div>Початок: {format(new Date(template.items[0].startTime), "HH:mm")}</div>
                      <div>Кінець: {format(new Date(template.items[template.items.length - 1].endTime), "HH:mm")}</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(template)
                  setNewTemplateName(template.name)
                  setSelectedDay(template.dayOfWeek.toString())
                  setIsRenameDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редагувати
              </Button>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Дублювати
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Діалог видалення шаблону */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Видалення шаблону</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Ви впевнені, що хочете видалити шаблон "{selectedTemplate?.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2">Ця дія незворотна.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Видалити
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Діалог перейменування шаблону */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редагування шаблону</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Назва шаблону</Label>
              <Input id="template-name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} />
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleRenameTemplate}>Зберегти</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

