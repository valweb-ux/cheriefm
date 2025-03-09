"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { updateHomepageSettingsAction } from "@/app/admin/settings/actions"
import type { HomepageSettings, HomepageSection } from "@/types/settings.types"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface HomepageSettingsFormProps {
  settings: HomepageSettings
}

export function HomepageSettingsForm({ settings }: HomepageSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<HomepageSection[]>(settings.featured_sections || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Додаємо секції до formData як JSON
      formData.append("featured_sections", JSON.stringify(sections))

      const result = await updateHomepageSettingsAction(formData)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти налаштування",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addSection = () => {
    const newSection: HomepageSection = {
      id: Date.now().toString(),
      title: "Нова секція",
      type: "news",
      display_order: sections.length + 1,
      is_visible: true,
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id))
  }

  const updateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, ...updates } : section)))
  }

  const moveSection = (fromIndex: number, toIndex: number) => {
    const result = Array.from(sections)
    const [removed] = result.splice(fromIndex, 1)
    result.splice(toIndex, 0, removed)

    // Оновлюємо display_order
    const updatedSections = result.map((section, index) => ({
      ...section,
      display_order: index + 1,
    }))

    setSections(updatedSections)
  }

  const onDragEnd = (result: any) => {
    // Якщо перетягування відбулося за межі списку або не змінило позицію
    if (!result.destination || result.destination.index === result.source.index) {
      return
    }

    moveSection(result.source.index, result.destination.index)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Головний банер</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Заголовок</Label>
                  <Input id="hero_title" name="hero_title" defaultValue={settings.hero_title || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Підзаголовок</Label>
                  <Input id="hero_subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_cta_text">Текст кнопки</Label>
                  <Input id="hero_cta_text" name="hero_cta_text" defaultValue={settings.hero_cta_text || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_cta_link">Посилання кнопки</Label>
                  <Input id="hero_cta_link" name="hero_cta_link" defaultValue={settings.hero_cta_link || ""} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hero_image">Зображення банера</Label>
                  <MediaPicker
                    value={settings.hero_image || ""}
                    onSelect={(url) => {
                      const input = document.querySelector('input[name="hero_image"]') as HTMLInputElement
                      if (input) input.value = url
                    }}
                  />
                  <Input type="hidden" name="hero_image" defaultValue={settings.hero_image || ""} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Секції головної сторінки</h3>
                <Button type="button" onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати секцію
                </Button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-md p-4 bg-card"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <h4 className="font-medium">Секція {index + 1}</h4>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (index > 0) {
                                        moveSection(index, index - 1)
                                      }
                                    }}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (index < sections.length - 1) {
                                        moveSection(index, index + 1)
                                      }
                                    }}
                                    disabled={index === sections.length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSection(section.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Заголовок</Label>
                                  <Input
                                    value={section.title}
                                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Тип контенту</Label>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={section.type}
                                    onChange={(e) =>
                                      updateSection(section.id, {
                                        type: e.target.value as
                                          | "news"
                                          | "programs"
                                          | "tracks"
                                          | "playlists"
                                          | "artists"
                                          | "custom",
                                      })
                                    }
                                  >
                                    <option value="news">Новини</option>
                                    <option value="programs">Програми</option>
                                    <option value="tracks">Треки</option>
                                    <option value="playlists">Плейлисти</option>
                                    <option value="artists">Виконавці</option>
                                    <option value="custom">Власний контент</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Підзаголовок</Label>
                                  <Input
                                    value={section.subtitle || ""}
                                    onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                                  />
                                </div>

                                <div className="flex items-center space-x-2 h-10">
                                  <Switch
                                    checked={section.is_visible}
                                    onCheckedChange={(checked) => updateSection(section.id, { is_visible: checked })}
                                    id={`visible-${section.id}`}
                                  />
                                  <Label htmlFor={`visible-${section.id}`}>Відображати секцію</Label>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {sections.length === 0 && (
                <div className="text-center py-8 border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">Немає секцій. Додайте першу секцію.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Відображення контенту</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch id="show_latest_news" name="show_latest_news" defaultChecked={settings.show_latest_news} />
                  <Label htmlFor="show_latest_news">Показувати останні новини</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_featured_programs"
                    name="show_featured_programs"
                    defaultChecked={settings.show_featured_programs}
                  />
                  <Label htmlFor="show_featured_programs">Показувати рекомендовані програми</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_upcoming_programs"
                    name="show_upcoming_programs"
                    defaultChecked={settings.show_upcoming_programs}
                  />
                  <Label htmlFor="show_upcoming_programs">Показувати майбутні програми</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_popular_tracks"
                    name="show_popular_tracks"
                    defaultChecked={settings.show_popular_tracks}
                  />
                  <Label htmlFor="show_popular_tracks">Показувати популярні треки</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SEO налаштування</h3>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO заголовок</Label>
                  <Input id="seo_title" name="seo_title" defaultValue={settings.seo_title || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO опис</Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    defaultValue={settings.seo_description || ""}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_keywords">SEO ключові слова</Label>
                  <Input
                    id="seo_keywords"
                    name="seo_keywords"
                    defaultValue={settings.seo_keywords || ""}
                    placeholder="радіо, музика, новини, програми"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Зберегти налаштування
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

