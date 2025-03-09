"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Save, Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { NavigationItem } from "@/types/settings.types"
import {
  createNavigationItemAction,
  updateNavigationItemAction,
  deleteNavigationItemAction,
  reorderNavigationItemsAction,
} from "@/app/admin/settings/actions"

interface NavigationManagerProps {
  items: NavigationItem[]
}

export function NavigationManager({ items: initialItems }: NavigationManagerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<NavigationItem[]>(initialItems)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("uk")
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    parent_id: "",
    order: 0,
    target: "_self" as "_self" | "_blank",
    is_active: true,
    language: "uk",
  })

  const filteredItems = items.filter((item) => item.language === currentLanguage)
  const parentItems = filteredItems.filter((item) => !item.parent_id)

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      parent_id: "",
      order: items.length,
      target: "_self",
      is_active: true,
      language: currentLanguage,
    })
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formDataObj = new FormData()

      // Додаємо всі дані
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "on" : "off")
        } else {
          formDataObj.append(key, String(value))
        }
      })

      const result = await createNavigationItemAction(formDataObj)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })

        // Оновлюємо локальний стан
        if (result.id) {
          const newItem: NavigationItem = {
            id: result.id,
            title: formData.title,
            url: formData.url,
            parent_id: formData.parent_id || null,
            order: formData.order as number,
            target: formData.target,
            is_active: formData.is_active,
            language: formData.language,
          }

          setItems([...items, newItem])
        }

        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating navigation item:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося створити пункт навігації",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem) return

    setIsProcessing(true)

    try {
      const formDataObj = new FormData()

      // Додаємо всі дані
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "on" : "off")
        } else {
          formDataObj.append(key, String(value))
        }
      })

      const result = await updateNavigationItemAction(selectedItem.id, formDataObj)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })

        // Оновлюємо локальний стан
        const updatedItems = items.map((item) => {
          if (item.id === selectedItem.id) {
            return {
              ...item,
              title: formData.title,
              url: formData.url,
              parent_id: formData.parent_id || null,
              order: formData.order as number,
              target: formData.target,
              is_active: formData.is_active,
              language: formData.language,
            }
          }
          return item
        })

        setItems(updatedItems)
        setIsEditDialogOpen(false)
        setSelectedItem(null)
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating navigation item:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося оновити пункт навігації",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей пункт навігації?")) {
      return
    }

    setIsProcessing(true)

    try {
      const result = await deleteNavigationItemAction(id)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })

        // Оновлюємо локальний стан
        const updatedItems = items.filter((item) => item.id !== id)
        setItems(updatedItems)
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting navigation item:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося видалити пункт навігації",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMoveItem = async (id: string, direction: "up" | "down") => {
    const itemIndex = filteredItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) return

    const item = filteredItems[itemIndex]
    const parentId = item.parent_id

    // Фільтруємо елементи з тим самим parent_id
    const siblingItems = filteredItems.filter((i) => i.parent_id === parentId)
    const siblingIndex = siblingItems.findIndex((i) => i.id === id)

    if (direction === "up" && siblingIndex === 0) return
    if (direction === "down" && siblingIndex === siblingItems.length - 1) return

    const targetIndex = direction === "up" ? siblingIndex - 1 : siblingIndex + 1
    const targetItem = siblingItems[targetIndex]

    // Міняємо порядок
    const updatedItems = items.map((i) => {
      if (i.id === id) {
        return { ...i, order: targetItem.order }
      }
      if (i.id === targetItem.id) {
        return { ...i, order: item.order }
      }
      return i
    })

    setItems(updatedItems)

    // Зберігаємо зміни на сервері
    try {
      const result = await reorderNavigationItemsAction([
        { id, order: targetItem.order },
        { id: targetItem.id, order: item.order },
      ])

      if (result.success) {
        toast({
          title: "Успішно",
          description: "Порядок пунктів навігації змінено",
        })
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })

        // Повертаємо початковий стан
        setItems(initialItems)
      }
    } catch (error) {
      console.error("Error reordering navigation items:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося змінити порядок пунктів навігації",
        variant: "destructive",
      })

      // Повертаємо початковий стан
      setItems(initialItems)
    }
  }

  const openEditDialog = (item: NavigationItem) => {
    setSelectedItem(item)
    setFormData({
      title: item.title,
      url: item.url,
      parent_id: item.parent_id || "",
      order: item.order,
      target: item.target,
      is_active: item.is_active,
      language: item.language,
    })
    setIsEditDialogOpen(true)
  }

  const renderNavigationItems = (parentId: string | null = null, level = 0) => {
    const levelItems = filteredItems.filter((item) => item.parent_id === parentId).sort((a, b) => a.order - b.order)

    if (levelItems.length === 0) return null

    return levelItems.map((item) => (
      <>
        <TableRow key={item.id}>
          <TableCell>
            <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center">
              {level > 0 && <span className="mr-2">└─</span>}
              {item.title}
            </div>
          </TableCell>
          <TableCell>{item.url}</TableCell>
          <TableCell>
            {item.target === "_blank" ? (
              <span className="flex items-center text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Нова вкладка
              </span>
            ) : (
              <span className="text-xs">Поточна вкладка</span>
            )}
          </TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {item.is_active ? "Активний" : "Неактивний"}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleMoveItem(item.id, "up")}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleMoveItem(item.id, "down")}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {renderNavigationItems(item.id, level + 1)}
      </>
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Пункти навігації</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Мова" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uk">Українська</SelectItem>
                <SelectItem value="fr">Французька</SelectItem>
                <SelectItem value="en">Англійська</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setFormData((prev) => ({ ...prev, language: currentLanguage }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Додати пункт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Додати пункт навігації</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateItem} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Назва</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => handleChange("url", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent_id">Батьківський пункт</Label>
                    <Select value={formData.parent_id} onValueChange={(value) => handleChange("parent_id", value)}>
                      <SelectTrigger id="parent_id">
                        <SelectValue placeholder="Виберіть батьківський пункт" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Немає (верхній рівень)</SelectItem>
                        {parentItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target">Відкривати посилання</Label>
                    <Select
                      value={formData.target}
                      onValueChange={(value) => handleChange("target", value as "_self" | "_blank")}
                    >
                      <SelectTrigger id="target">
                        <SelectValue placeholder="Виберіть спосіб відкриття" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">У поточній вкладці</SelectItem>
                        <SelectItem value="_blank">У новій вкладці</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange("is_active", checked)}
                    />
                    <Label htmlFor="is_active">Активний пункт</Label>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Скасувати
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
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
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Відкриття</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Немає пунктів навігації для цієї мови
                  </TableCell>
                </TableRow>
              ) : (
                renderNavigationItems()
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати пункт навігації</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditItem} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_title">Назва</Label>
              <Input
                id="edit_title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_url">URL</Label>
              <Input
                id="edit_url"
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_parent_id">Батьківський пункт</Label>
              <Select value={formData.parent_id} onValueChange={(value) => handleChange("parent_id", value)}>
                <SelectTrigger id="edit_parent_id">
                  <SelectValue placeholder="Виберіть батьківський пункт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Немає (верхній рівень)</SelectItem>
                  {parentItems
                    .filter((item) => item.id !== selectedItem?.id) // Виключаємо поточний елемент
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_target">Відкривати посилання</Label>
              <Select
                value={formData.target}
                onValueChange={(value) => handleChange("target", value as "_self" | "_blank")}
              >
                <SelectTrigger id="edit_target">
                  <SelectValue placeholder="Виберіть спосіб відкриття" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">У поточній вкладці</SelectItem>
                  <SelectItem value="_blank">У новій вкладці</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange("is_active", checked)}
              />
              <Label htmlFor="edit_is_active">Активний пункт</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

