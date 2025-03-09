"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface Program {
  id: string
  title: string
}

interface SpecialBroadcast {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  program_id: string | null
  replaces_program_id: string | null
  is_active: boolean
  created_at: string
}

export function SpecialBroadcastManager() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [specialBroadcasts, setSpecialBroadcasts] = useState<SpecialBroadcast[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBroadcast, setSelectedBroadcast] = useState<SpecialBroadcast | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    program_id: "",
    replaces_program_id: "",
    is_active: true,
  })

  // Завантаження спеціальних ефірів
  useEffect(() => {
    const fetchSpecialBroadcasts = async () => {
      try {
        const response = await fetch("/api/admin/schedule/special")

        if (!response.ok) {
          throw new Error(`Помилка завантаження: ${response.status}`)
        }

        const data = await response.json()
        setSpecialBroadcasts(data)
      } catch (error) {
        console.error("Помилка при завантаженні спеціальних ефірів:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити спеціальні ефіри",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialBroadcasts()
  }, [])

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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      program_id: "",
      replaces_program_id: "",
      is_active: true,
    })
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateBroadcast = async () => {
    try {
      // Валідація
      if (!formData.title || !formData.start_time || !formData.end_time) {
        throw new Error("Заповніть всі обов'язкові поля")
      }

      if (new Date(formData.end_time) <= new Date(formData.start_time)) {
        throw new Error("Кінцевий час має бути пізніше початкового")
      }

      const response = await fetch("/api/admin/schedule/special", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          program_id: formData.program_id || null,
          replaces_program_id: formData.replaces_program_id || null,
          is_active: formData.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error(`Помилка створення: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Спеціальний ефір створено",
        })

        // Оновлюємо список
        const updatedResponse = await fetch("/api/admin/schedule/special")
        const updatedData = await updatedResponse.json()
        setSpecialBroadcasts(updatedData)

        // Закриваємо діалог і скидаємо форму
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        throw new Error(result.message || "Помилка при створенні")
      }
    } catch (error) {
      console.error("Помилка при створенні спеціального ефіру:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося створити спеціальний ефір",
        variant: "destructive",
      })
    }
  }

  const handleEditBroadcast = async () => {
    if (!selectedBroadcast) return

    try {
      // Валідація
      if (!formData.title || !formData.start_time || !formData.end_time) {
        throw new Error("Заповніть всі обов'язкові поля")
      }

      if (new Date(formData.end_time) <= new Date(formData.start_time)) {
        throw new Error("Кінцевий час має бути пізніше початкового")
      }

      const response = await fetch(`/api/admin/schedule/special/${selectedBroadcast.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          program_id: formData.program_id || null,
          replaces_program_id: formData.replaces_program_id || null,
          is_active: formData.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error(`Помилка оновлення: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Спеціальний ефір оновлено",
        })

        // Оновлюємо список
        const updatedResponse = await fetch("/api/admin/schedule/special")
        const updatedData = await updatedResponse.json()
        setSpecialBroadcasts(updatedData)

        // Закриваємо діалог і скидаємо форму
        setIsEditDialogOpen(false)
        setSelectedBroadcast(null)
        resetForm()
      } else {
        throw new Error(result.message || "Помилка при оновленні")
      }
    } catch (error) {
      console.error("Помилка при оновленні спеціального ефіру:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося оновити спеціальний ефір",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBroadcast = async () => {
    if (!selectedBroadcast) return

    try {
      const response = await fetch(`/api/admin/schedule/special/${selectedBroadcast.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Помилка видалення: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Спеціальний ефір видалено",
        })

        // Оновлюємо список
        setSpecialBroadcasts(specialBroadcasts.filter((b) => b.id !== selectedBroadcast.id))

        // Закриваємо діалог
        setIsDeleteDialogOpen(false)
        setSelectedBroadcast(null)
      } else {
        throw new Error(result.message || "Помилка при видаленні")
      }
    } catch (error) {
      console.error("Помилка при видаленні спеціального ефіру:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося видалити спеціальний ефір",
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
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Створити спеціальний ефір
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Створення спеціального ефіру</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Назва</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Введіть назву спеціального ефіру"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Введіть опис спеціального ефіру"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Час початку</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => handleChange("start_time", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Час закінчення</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => handleChange("end_time", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program_id">Програма</Label>
                <Select value={formData.program_id} onValueChange={(value) => handleChange("program_id", value)}>
                  <SelectTrigger id="program_id">
                    <SelectValue placeholder="Виберіть програму" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Немає (власний ефір)</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replaces_program_id">Замінює програму</Label>
                <Select
                  value={formData.replaces_program_id}
                  onValueChange={(value) => handleChange("replaces_program_id", value)}
                >
                  <SelectTrigger id="replaces_program_id">
                    <SelectValue placeholder="Виберіть програму для заміни" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Немає (додатковий ефір)</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked as boolean)}
                />
                <Label htmlFor="is_active">Активний</Label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateBroadcast}>Створити</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialBroadcasts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Немає спеціальних ефірів. Створіть перший спеціальний ефір, натиснувши кнопку вище.
          </div>
        ) : (
          specialBroadcasts.map((broadcast) => (
            <Card key={broadcast.id} className={broadcast.is_active ? "" : "opacity-60"}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{broadcast.title}</CardTitle>
                  {!broadcast.is_active && (
                    <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-md flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Неактивний
                    </div>
                  )}
                </div>
                <CardDescription>
                  {format(parseISO(broadcast.start_time), "d MMMM yyyy, HH:mm", { locale: uk })} -
                  {format(parseISO(broadcast.end_time), " HH:mm", { locale: uk })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {broadcast.description && <p className="text-muted-foreground">{broadcast.description}</p>}

                  {broadcast.program_id && (
                    <div>
                      <span className="font-medium">Програма: </span>
                      {programs.find((p) => p.id === broadcast.program_id)?.title || "Невідома програма"}
                    </div>
                  )}

                  {broadcast.replaces_program_id && (
                    <div>
                      <span className="font-medium">Замінює: </span>
                      {programs.find((p) => p.id === broadcast.replaces_program_id)?.title || "Невідома програма"}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBroadcast(broadcast)
                    setFormData({
                      title: broadcast.title,
                      description: broadcast.description,
                      start_time: broadcast.start_time.slice(0, 16),
                      end_time: broadcast.end_time.slice(0, 16),
                      program_id: broadcast.program_id || "",
                      replaces_program_id: broadcast.replaces_program_id || "",
                      is_active: broadcast.is_active,
                    })
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedBroadcast(broadcast)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Діалог редагування */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редагування спеціального ефіру</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Назва</Label>
              <Input id="edit-title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Опис</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_time">Час початку</Label>
                <Input
                  id="edit-start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => handleChange("start_time", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-end_time">Час закінчення</Label>
                <Input
                  id="edit-end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => handleChange("end_time", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-program_id">Програма</Label>
              <Select value={formData.program_id} onValueChange={(value) => handleChange("program_id", value)}>
                <SelectTrigger id="edit-program_id">
                  <SelectValue placeholder="Виберіть програму" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Немає (власний ефір)</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-replaces_program_id">Замінює програму</Label>
              <Select
                value={formData.replaces_program_id}
                onValueChange={(value) => handleChange("replaces_program_id", value)}
              >
                <SelectTrigger id="edit-replaces_program_id">
                  <SelectValue placeholder="Виберіть програму для заміни" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Немає (додатковий ефір)</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange("is_active", checked as boolean)}
              />
              <Label htmlFor="edit-is_active">Активний</Label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditBroadcast}>Зберегти зміни</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Діалог видалення */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Видалення спеціального ефіру</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Ви впевнені, що хочете видалити спеціальний ефір "{selectedBroadcast?.title}"?</p>
            <p className="text-sm text-muted-foreground mt-2">Ця дія незворотна.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleDeleteBroadcast}>
              Видалити
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

