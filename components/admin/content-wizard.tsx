"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultilingualEditor } from "@/components/admin/multilingual-editor"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react"

interface ContentWizardProps {
  type: "news" | "program" | "page"
  onSubmit: (data: any) => Promise<{ success: boolean; id?: string; error?: string }>
  languages: Array<{ code: string; name: string; flag: string }>
  defaultLanguage?: string
}

export function ContentWizard({ type, onSubmit, languages, defaultLanguage = "uk" }: ContentWizardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: {},
    slug: {},
    excerpt: {},
    content: {},
    image: "",
    category: "",
    tags: [],
    featured: false,
    published: false,
    publish_date: new Date().toISOString().split("T")[0],
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultilingualChange = (field: string, value: Record<string, string>) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (url: string) => {
    handleChange("image", url)
  }

  const handleNext = () => {
    // Валідація для кожного кроку
    if (step === 1) {
      // Перевіряємо заголовок основною мовою
      if (!formData.title[defaultLanguage]) {
        toast({
          title: "Помилка",
          description: "Заповніть заголовок основною мовою",
          variant: "destructive",
        })
        return
      }

      // Перевіряємо URL основною мовою
      if (!formData.slug[defaultLanguage]) {
        toast({
          title: "Помилка",
          description: "Заповніть URL основною мовою",
          variant: "destructive",
        })
        return
      }
    }

    if (step === 2) {
      // Перевіряємо вміст основною мовою
      if (!formData.content[defaultLanguage]) {
        toast({
          title: "Помилка",
          description: "Заповніть вміст основною мовою",
          variant: "destructive",
        })
        return
      }
    }

    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const result = await onSubmit(formData)

      if (result.success) {
        toast({
          title: "Успішно збережено",
          description: `${type === "news" ? "Новину" : type === "program" ? "Програму" : "Сторінку"} успішно створено`,
        })

        // Перенаправляємо на сторінку редагування або списку
        if (result.id) {
          router.push(
            `/admin/${type === "news" ? "news" : type === "program" ? "programs" : "pages"}/edit/${result.id}`,
          )
        } else {
          router.push(`/admin/${type === "news" ? "news" : type === "program" ? "programs" : "pages"}`)
        }
      } else {
        toast({
          title: "Помилка",
          description: result.error || "Не вдалося зберегти дані",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти дані",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Основна інформація"
      case 2:
        return "Вміст"
      case 3:
        return "Медіа"
      case 4:
        return "Публікація"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {type === "news" ? "Створення новини" : type === "program" ? "Створення програми" : "Створення сторінки"}:
          Крок {step} - {getStepTitle()}
        </CardTitle>
        <CardDescription>
          Заповніть необхідні поля для створення{" "}
          {type === "news" ? "новини" : type === "program" ? "програми" : "сторінки"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Крок 1: Основна інформація */}
        {step === 1 && (
          <div className="space-y-6">
            <MultilingualEditor
              fieldName="title"
              label="Заголовок"
              values={formData.title}
              onChange={handleMultilingualChange}
              type="input"
              required
              languages={languages}
              defaultLanguage={defaultLanguage}
            />

            <MultilingualEditor
              fieldName="slug"
              label="URL (slug)"
              values={formData.slug}
              onChange={handleMultilingualChange}
              type="input"
              required
              languages={languages}
              defaultLanguage={defaultLanguage}
            />

            <MultilingualEditor
              fieldName="excerpt"
              label="Короткий опис"
              values={formData.excerpt}
              onChange={handleMultilingualChange}
              type="textarea"
              languages={languages}
              defaultLanguage={defaultLanguage}
            />
          </div>
        )}

        {/* Крок 2: Вміст */}
        {step === 2 && (
          <div className="space-y-6">
            <MultilingualEditor
              fieldName="content"
              label="Вміст"
              values={formData.content}
              onChange={handleMultilingualChange}
              type="wysiwyg"
              required
              languages={languages}
              defaultLanguage={defaultLanguage}
            />
          </div>
        )}

        {/* Крок 3: Медіа */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Головне зображення</Label>
              <MediaPicker value={formData.image} onChange={handleImageSelect} filter="images" />
            </div>
          </div>
        )}

        {/* Крок 4: Публікація */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="publish_date">Дата публікації</Label>
              <Input
                id="publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => handleChange("publish_date", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published">Опублікувати одразу</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="featured">Додати до вибраного</Label>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          )}
        </div>

        <div>
          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              Далі
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
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
      </CardFooter>
    </Card>
  )
}

