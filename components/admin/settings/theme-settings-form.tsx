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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateThemeSettingsAction } from "@/app/admin/settings/actions"
import type { ThemeSettings } from "@/types/settings.types"

interface ThemeSettingsFormProps {
  settings: ThemeSettings
}

export function ThemeSettingsForm({ settings }: ThemeSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color)
  const [secondaryColor, setSecondaryColor] = useState(settings.secondary_color)
  const [accentColor, setAccentColor] = useState(settings.accent_color)
  const [textColor, setTextColor] = useState(settings.text_color)
  const [backgroundColor, setBackgroundColor] = useState(settings.background_color)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateThemeSettingsAction(formData)

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Кольори</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Основний колір</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary_color"
                      name="primary_color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      required
                    />
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Додатковий колір</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary_color"
                      name="secondary_color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      required
                    />
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent_color">Акцентний колір</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accent_color"
                      name="accent_color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      required
                    />
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_color">Колір тексту</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="text_color"
                      name="text_color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      required
                    />
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_color">Колір фону</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="background_color"
                      name="background_color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      required
                    />
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-2">Попередній перегляд кольорів</h4>
                <div className="flex flex-wrap gap-4">
                  <div
                    className="w-24 h-24 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white text-xs font-medium">Основний</span>
                  </div>
                  <div
                    className="w-24 h-24 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <span className="text-white text-xs font-medium">Додатковий</span>
                  </div>
                  <div
                    className="w-24 h-24 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="text-white text-xs font-medium">Акцентний</span>
                  </div>
                  <div
                    className="w-24 h-24 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: backgroundColor, color: textColor, border: "1px solid #ddd" }}
                  >
                    <span className="text-xs font-medium">Текст</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Стилі та шрифти</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="font_family">Шрифт</Label>
                  <Select defaultValue={settings.font_family} name="font_family">
                    <SelectTrigger id="font_family">
                      <SelectValue placeholder="Виберіть шрифт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                      <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                      <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                      <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border_radius">Заокруглення кутів</Label>
                  <Select defaultValue={settings.border_radius} name="border_radius">
                    <SelectTrigger id="border_radius">
                      <SelectValue placeholder="Виберіть радіус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Без заокруглення</SelectItem>
                      <SelectItem value="4px">Мале (4px)</SelectItem>
                      <SelectItem value="8px">Середнє (8px)</SelectItem>
                      <SelectItem value="12px">Велике (12px)</SelectItem>
                      <SelectItem value="16px">Дуже велике (16px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="header_style">Стиль шапки</Label>
                  <Select defaultValue={settings.header_style} name="header_style">
                    <SelectTrigger id="header_style">
                      <SelectValue placeholder="Виберіть стиль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Стандартний</SelectItem>
                      <SelectItem value="transparent">Прозорий</SelectItem>
                      <SelectItem value="colored">Кольоровий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer_style">Стиль футера</Label>
                  <Select defaultValue={settings.footer_style} name="footer_style">
                    <SelectTrigger id="footer_style">
                      <SelectValue placeholder="Виберіть стиль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Стандартний</SelectItem>
                      <SelectItem value="minimal">Мінімалістичний</SelectItem>
                      <SelectItem value="expanded">Розширений</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_style">Стиль кнопок</Label>
                  <Select defaultValue={settings.button_style} name="button_style">
                    <SelectTrigger id="button_style">
                      <SelectValue placeholder="Виберіть стиль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Стандартний</SelectItem>
                      <SelectItem value="rounded">Заокруглений</SelectItem>
                      <SelectItem value="pill">Пігулка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Додаткові налаштування</h3>

              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_dark_mode_enabled"
                    name="is_dark_mode_enabled"
                    defaultChecked={settings.is_dark_mode_enabled}
                  />
                  <Label htmlFor="is_dark_mode_enabled">Увімкнути темну тему</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_rtl_support_enabled"
                    name="is_rtl_support_enabled"
                    defaultChecked={settings.is_rtl_support_enabled}
                  />
                  <Label htmlFor="is_rtl_support_enabled">Підтримка RTL (справа наліво)</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_css">Власний CSS</Label>
                  <Textarea
                    id="custom_css"
                    name="custom_css"
                    defaultValue={settings.custom_css || ""}
                    rows={8}
                    placeholder="/* Додайте власні CSS стилі тут */"
                    className="font-mono text-sm"
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

