"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getProgramById, createProgram, updateProgram } from "@/lib/supabase/api"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { MultilingualField } from "@/components/admin/multilingual-field"
import { HelpTooltip } from "@/components/admin/help-tooltip"
import { TranslationTools } from "@/components/admin/translation-tools"
import { WizardSteps } from "@/components/admin/wizard-steps"

interface ProgramFormProps {
  id?: string
}

interface ProgramData {
  title: {
    [key: string]: string
  }
  description: {
    [key: string]: string
  }
  slug: {
    [key: string]: string
  }
  host: string
  image: string
  day_of_week: string
  air_time: string
  duration: number
  is_active: boolean
  is_featured: boolean
  // Нові поля для розширених функцій
  hosts: string[]
  color: string
  recurrence_type: string
  recurrence_days: number[]
  recurrence_end_date: string
  calendar_sync_enabled: boolean
  calendar_id: string
}

const dayOfWeekOptions = [
  { value: "monday", label: "Понеділок" },
  { value: "tuesday", label: "Вівторок" },
  { value: "wednesday", label: "Середа" },
  { value: "thursday", label: "Четвер" },
  { value: "friday", label: "П'ятниця" },
  { value: "saturday", label: "Субота" },
  { value: "sunday", label: "Неділя" },
]

export function ProgramForm({ id }: ProgramFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<ProgramData>({
    title: { uk: "", fr: "", en: "" },
    description: { uk: "", fr: "", en: "" },
    slug: { uk: "", fr: "", en: "" },
    host: "",
    image: "",
    day_of_week: "monday",
    air_time: "12:00",
    duration: 60,
    is_active: true,
    is_featured: false,
    // Нові поля для розширених функцій
    hosts: [],
    color: "#3182ce",
    recurrence_type: "none",
    recurrence_days: [],
    recurrence_end_date: "",
    calendar_sync_enabled: false,
    calendar_id: "",
  })

  const wizardSteps = [
    { id: 1, title: "Основна інформація", description: "Назва, URL, опис" },
    { id: 2, title: "Розклад", description: "Час ефіру, тривалість" },
    { id: 3, title: "Медіа", description: "Зображення, колір" },
    { id: 4, title: "Налаштування", description: "Активність, повторення" },
  ]

  // Завантажуємо дані програми, якщо це редагування
  useEffect(() => {
    if (id) {
      const fetchProgramData = async () => {
        setLoading(true)
        try {
          const programData = await getProgramById(id)

          // Форматуємо дані для форми
          setFormData({
            title: {
              uk: programData.title_uk,
              fr: programData.title_fr || "",
              en: programData.title_en || "",
            },
            description: {
              uk: programData.description_uk,
              fr: programData.description_fr || "",
              en: programData.description_en || "",
            },
            slug: {
              uk: programData.slug_uk,
              fr: programData.slug_fr || "",
              en: programData.slug_en || "",
            },
            host: programData.host || "",
            image: programData.image || "",
            day_of_week: programData.day_of_week,
            air_time: programData.air_time,
            duration: programData.duration,
            is_active: programData.is_active,
            is_featured: programData.is_featured,
            hosts: programData.hosts || [],
            color: programData.color || "#3182ce",
            recurrence_type: programData.recurrence_type || "none",
            recurrence_days: programData.recurrence_days || [],
            recurrence_end_date: programData.recurrence_end_date || "",
            calendar_sync_enabled: programData.calendar_sync_enabled || false,
            calendar_id: programData.calendar_id || "",
          })
        } catch (error) {
          console.error("Помилка при завантаженні програми:", error)
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити дані програми",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchProgramData()
    }
  }, [id])

  const handleChange = (field: keyof ProgramData, value: string | boolean | number | string[], lang?: string) => {
    if (lang && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field as keyof Pick<ProgramData, "title" | "description" | "slug">],
          [lang]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Автоматично генеруємо slug з заголовка
    if (field === "title" && lang && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^\wа-яіїєґ\s]/g, "") // Видаляємо спеціальні символи
        .replace(/\s+/g, "-") // Замінюємо пробіли на дефіси
        .replace(/[а-яіїєґ]/g, (char) => {
          // Транслітерація українських символів
          const translitMap: { [key: string]: string } = {
            а: "a",
            б: "b",
            в: "v",
            г: "g",
            ґ: "g",
            д: "d",
            е: "e",
            є: "ye",
            ж: "zh",
            з: "z",
            и: "y",
            і: "i",
            ї: "yi",
            й: "y",
            к: "k",
            л: "l",
            м: "m",
            н: "n",
            о: "o",
            п: "p",
            р: "r",
            с: "s",
            т: "t",
            у: "u",
            ф: "f",
            х: "kh",
            ц: "ts",
            ч: "ch",
            ш: "sh",
            щ: "shch",
            ь: "",
            ю: "yu",
            я: "ya",
          }
          return translitMap[char] || char
        })

      setFormData((prev) => ({
        ...prev,
        slug: {
          ...prev.slug,
          [lang]: slug,
        },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Перевіряємо обов'язкові поля
      if (!formData.title.uk) {
        throw new Error("Назва програми українською є обов'язковою")
      }

      if (!formData.description.uk) {
        throw new Error("Опис програми українською є обов'язковим")
      }

      if (!formData.slug.uk) {
        throw new Error("URL-адреса українською є обов'язковою")
      }

      // Відправляємо дані
      const programData = {
        title_uk: formData.title.uk,
        title_fr: formData.title.fr || null,
        title_en: formData.title.en || null,
        description_uk: formData.description.uk,
        description_fr: formData.description.fr || null,
        description_en: formData.description.en || null,
        slug_uk: formData.slug.uk,
        slug_fr: formData.slug.fr || null,
        slug_en: formData.slug.en || null,
        host: formData.host || null,
        image: formData.image || null,
        day_of_week: formData.day_of_week,
        air_time: formData.air_time,
        duration: formData.duration,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        hosts: formData.hosts || [],
        color: formData.color || "#3182ce",
        recurrence_type: formData.recurrence_type || "none",
        recurrence_days: formData.recurrence_days || [],
        recurrence_end_date: formData.recurrence_end_date || "",
        calendar_sync_enabled: formData.calendar_sync_enabled,
        calendar_id: formData.calendar_id || "",
      }

      let result

      if (id) {
        // Оновлюємо існуючу програму
        result = await updateProgram(id, programData)
      } else {
        // Створюємо нову програму
        result = await createProgram(programData)
      }

      if (result.success) {
        toast({
          title: "Успішно",
          description: id ? "Програму оновлено" : "Програму створено",
        })
        router.push("/admin/programs")
      } else {
        throw new Error(result.error || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні програми:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти програму",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleTranslate = (language: "uk" | "fr" | "en", translatedText: string) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [language]: translatedText,
      },
    }))
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
        <WizardSteps steps={wizardSteps} currentStep={currentStep} onStepClick={setCurrentStep} />

        {/* Крок 1: Основна інформація */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
              <CardDescription>
                Заповніть основні дані про програму. Поля, позначені зірочкою (*), обов'язкові для заповнення
                українською мовою.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <MultilingualField
                label="Назва програми"
                fieldName="title"
                values={formData.title}
                onChange={handleChange}
                required={true}
                tooltip="Назва радіопрограми, яка буде відображатися на сайті"
                placeholder={{
                  uk: "Введіть назву українською",
                  fr: "Введіть назву французькою",
                  en: "Введіть назву англійською",
                }}
              />

              <MultilingualField
                label="URL-адреса"
                fieldName="slug"
                values={formData.slug}
                onChange={handleChange}
                required={true}
                tooltip="Унікальна адреса сторінки програми. Використовуйте лише латинські літери, цифри та дефіси. Генерується автоматично з назви."
                placeholder={{
                  uk: "url-programy",
                  fr: "url-de-programme",
                  en: "program-url",
                }}
              />

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="host">Ведучий</Label>
                  <HelpTooltip content="Ім'я ведучого програми" />
                </div>
                <Input
                  id="host"
                  value={formData.host}
                  onChange={(e) => handleChange("host", e.target.value)}
                  placeholder="Ім'я ведучого"
                />
              </div>

              <TranslationTools
                sourceLanguage="uk"
                targetLanguages={["fr", "en"]}
                sourceContent={formData.description.uk}
                onTranslate={handleTranslate}
              />

              <MultilingualField
                label="Опис програми"
                fieldName="description"
                values={formData.description}
                onChange={handleChange}
                type="textarea"
                rows={5}
                required={true}
                tooltip="Детальний опис програми"
                placeholder={{
                  uk: "Введіть опис українською",
                  fr: "Введіть опис французькою",
                  en: "Введіть опис англійською",
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Крок 2: Розклад */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Розклад ефіру</CardTitle>
              <CardDescription>Вкажіть день тижня, час ефіру та тривалість програми.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="day_of_week">День тижня</Label>
                    <HelpTooltip content="День тижня, коли програма виходить в ефір" />
                  </div>
                  <Select value={formData.day_of_week} onValueChange={(value) => handleChange("day_of_week", value)}>
                    <SelectTrigger id="day_of_week">
                      <SelectValue placeholder="Виберіть день тижня" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOfWeekOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="air_time">Час ефіру</Label>
                    <HelpTooltip content="Час початку програми в ефірі" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="air_time"
                      type="time"
                      value={formData.air_time}
                      onChange={(e) => handleChange("air_time", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="duration">Тривалість (хвилин)</Label>
                    <HelpTooltip content="Тривалість програми в хвилинах" />
                  </div>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="360"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", Number.parseInt(e.target.value, 10))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Крок 3: Медіа */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Медіа та оформлення</CardTitle>
              <CardDescription>Додайте зображення та виберіть колір для програми.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="image">Зображення</Label>
                    <HelpTooltip content="Зображення програми, яке буде відображатися на сайті. Рекомендований розмір: 800x450 пікселів." />
                  </div>
                  <MediaPicker value={formData.image} onSelect={(url) => handleChange("image", url)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="color">Колір програми</Label>
                    <HelpTooltip content="Колір, який буде використовуватися для виділення програми в розкладі та на сайті" />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color || "#3182ce"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.color || "#3182ce"}
                      onChange={(e) => handleChange("color", e.target.value)}
                      placeholder="#HEX"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Крок 4: Налаштування */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Налаштування програми</CardTitle>
              <CardDescription>Налаштуйте активність програми, повторення та інші параметри.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange("is_active", checked)}
                    />
                    <div>
                      <Label htmlFor="is_active" className="flex items-center">
                        Активна програма
                        <HelpTooltip content="Якщо вимкнено, програма не буде відображатися на сайті" />
                      </Label>
                      <p className="text-sm text-muted-foreground">Відображати програму на сайті</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleChange("is_featured", checked)}
                    />
                    <div>
                      <Label htmlFor="is_featured" className="flex items-center">
                        Рекомендована програма
                        <HelpTooltip content="Рекомендовані програми відображаються на головній сторінці" />
                      </Label>
                      <p className="text-sm text-muted-foreground">Показувати на головній сторінці</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="recurrence_type">Тип повторення</Label>
                      <HelpTooltip content="Як часто програма повторюється в ефірі" />
                    </div>
                    <Select
                      value={formData.recurrence_type || "none"}
                      onValueChange={(value) => handleChange("recurrence_type", value)}
                    >
                      <SelectTrigger id="recurrence_type">
                        <SelectValue placeholder="Виберіть тип повторення" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без повторення</SelectItem>
                        <SelectItem value="daily">Щодня</SelectItem>
                        <SelectItem value="weekly">Щотижня</SelectItem>
                        <SelectItem value="custom">Власний</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.recurrence_type === "custom" && (
                    <div className="space-y-2">
                      <Label>Дні повторення</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <Checkbox
                              id={`day-${index}`}
                              checked={formData.recurrence_days?.includes(index) || false}
                              onCheckedChange={(checked) => {
                                const days = [...(formData.recurrence_days || [])]
                                if (checked) {
                                  if (!days.includes(index)) days.push(index)
                                } else {
                                  const dayIndex = days.indexOf(index)
                                  if (dayIndex !== -1) days.splice(dayIndex, 1)
                                }
                                handleChange("recurrence_days", days)
                              }}
                            />
                            <Label htmlFor={`day-${index}`} className="mt-1">
                              {day}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.recurrence_type !== "none" && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="recurrence_end_date">Дата закінчення повторень</Label>
                        <HelpTooltip content="Дата, коли програма перестане повторюватися" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recurrence_end_date"
                          type="date"
                          value={formData.recurrence_end_date || ""}
                          onChange={(e) => handleChange("recurrence_end_date", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => router.push("/admin/programs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад до списку
            </Button>
          )}

          {currentStep < wizardSteps.length ? (
            <Button type="button" onClick={nextStep}>
              Далі
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
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
          )}
        </div>
      </div>
    </form>
  )
}

