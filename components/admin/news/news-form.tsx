"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getNewsById, createNews, updateNews, getCategories } from "@/lib/supabase/api"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { MultilingualField } from "@/components/admin/multilingual-field"
import { HelpTooltip } from "@/components/admin/help-tooltip"
import { TranslationTools } from "@/components/admin/translation-tools"
import { WizardSteps } from "@/components/admin/wizard-steps"

interface NewsFormProps {
  id?: string
}

interface NewsData {
  title: {
    [key: string]: string
  }
  content: {
    [key: string]: string
  }
  excerpt: {
    [key: string]: string
  }
  slug: {
    [key: string]: string
  }
  image: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publish_date: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export function NewsForm({ id }: NewsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<NewsData>({
    title: { uk: "", fr: "", en: "" },
    content: { uk: "", fr: "", en: "" },
    excerpt: { uk: "", fr: "", en: "" },
    slug: { uk: "", fr: "", en: "" },
    image: "",
    category: "",
    tags: [],
    featured: false,
    published: false,
    publish_date: new Date().toISOString().split("T")[0],
  })

  const wizardSteps = [
    { id: 1, title: "Основна інформація", description: "Заголовок, URL, опис" },
    { id: 2, title: "Зміст", description: "Детальний текст новини" },
    { id: 3, title: "Медіа та категорії", description: "Зображення, категорії, теги" },
    { id: 4, title: "Публікація", description: "Налаштування публікації" },
  ]

  // Завантажуємо категорії
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Помилка при завантаженні категорій:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити категорії",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [])

  // Завантажуємо дані новини, якщо це редагування
  useEffect(() => {
    if (id) {
      const fetchNewsData = async () => {
        setLoading(true)
        try {
          const newsData = await getNewsById(id)

          // Форматуємо дані для форми
          const formattedData: NewsData = {
            title: { uk: newsData.title },
            content: { uk: newsData.content },
            excerpt: { uk: newsData.excerpt },
            slug: { uk: newsData.slug },
            image: newsData.image_url,
            category: newsData.category_id,
            tags: newsData.tags?.map((tag: any) => tag.name) || [],
            featured: newsData.is_featured,
            published: newsData.is_published,
            publish_date: newsData.publish_date.split("T")[0],
          }

          // Додаємо переклади
          if (newsData.translations) {
            Object.keys(newsData.translations).forEach((lang) => {
              formattedData.title[lang] = newsData.translations[lang].title
              formattedData.content[lang] = newsData.translations[lang].content
              formattedData.excerpt[lang] = newsData.translations[lang].excerpt
              formattedData.slug[lang] = newsData.translations[lang].slug
            })
          }

          setFormData(formattedData)
        } catch (error) {
          console.error("Помилка при завантаженні новини:", error)
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити дані новини",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchNewsData()
    }
  }, [id])

  const handleChange = (field: keyof NewsData, value: string | boolean | string[], lang?: string) => {
    if (lang && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field as keyof Pick<NewsData, "title" | "content" | "excerpt" | "slug">],
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
        throw new Error("Заголовок українською є обов'язковим")
      }

      if (!formData.content.uk) {
        throw new Error("Зміст українською є обов'язковим")
      }

      if (!formData.category) {
        throw new Error("Виберіть категорію")
      }

      // Відправляємо дані
      let result

      if (id) {
        // Оновлюємо існуючу новину
        result = await updateNews(id, formData)
      } else {
        // Створюємо нову новину
        result = await createNews(formData)
      }

      if (result.success) {
        toast({
          title: "Успішно",
          description: id ? "Новину оновлено" : "Новину створено",
        })
        router.push("/admin/news")
      } else {
        throw new Error(result.error || "Помилка при збереженні")
      }
    } catch (error) {
      console.error("Помилка при збереженні новини:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти новину",
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
      content: {
        ...prev.content,
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
                Заповніть основні дані про новину. Поля, позначені зірочкою (*), обов'язкові для заповнення українською
                мовою.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <MultilingualField
                label="Заголовок"
                fieldName="title"
                values={formData.title}
                onChange={handleChange}
                required={true}
                tooltip="Заголовок новини, який буде відображатися на сайті"
                placeholder={{
                  uk: "Введіть заголовок українською",
                  fr: "Введіть заголовок французькою",
                  en: "Введіть заголовок англійською",
                }}
              />

              <MultilingualField
                label="URL-адреса"
                fieldName="slug"
                values={formData.slug}
                onChange={handleChange}
                required={true}
                tooltip="Унікальна адреса сторінки. Використовуйте лише латинські літери, цифри та дефіси. Генерується автоматично з заголовка."
                placeholder={{
                  uk: "url-novyny",
                  fr: "url-de-nouvelles",
                  en: "news-url",
                }}
              />

              <MultilingualField
                label="Короткий опис"
                fieldName="excerpt"
                values={formData.excerpt}
                onChange={handleChange}
                type="textarea"
                rows={2}
                tooltip="Короткий опис новини, який буде відображатися в списках та анонсах"
                placeholder={{
                  uk: "Введіть короткий опис українською",
                  fr: "Введіть короткий опис французькою",
                  en: "Введіть короткий опис англійською",
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Крок 2: Зміст */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Зміст новини</CardTitle>
              <CardDescription>
                Введіть повний текст новини. Ви можете використовувати інструменти перекладу для автоматичного
                заповнення інших мов.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TranslationTools
                sourceLanguage="uk"
                targetLanguages={["fr", "en"]}
                sourceContent={formData.content.uk}
                onTranslate={handleTranslate}
              />

              <MultilingualField
                label="Зміст новини"
                fieldName="content"
                values={formData.content}
                onChange={handleChange}
                type="textarea"
                rows={10}
                required={true}
                tooltip="Повний текст новини"
                placeholder={{
                  uk: "Введіть текст новини українською",
                  fr: "Введіть текст новини французькою",
                  en: "Введіть текст новини англійською",
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Крок 3: Медіа та категорії */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Медіа та категорії</CardTitle>
              <CardDescription>Додайте зображення, виберіть категорію та вкажіть теги для новини.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="image">Зображення</Label>
                    <HelpTooltip content="Головне зображення новини. Рекомендований розмір: 1200x630 пікселів." />
                  </div>
                  <MediaPicker value={formData.image} onSelect={(url) => handleChange("image", url)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="category">Категорія</Label>
                    <HelpTooltip content="Виберіть категорію, до якої належить новина." />
                  </div>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Виберіть категорію" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="default" disabled>
                          Немає доступних категорій
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center">
                    <Label htmlFor="tags">Теги</Label>
                    <HelpTooltip content="Теги допомагають користувачам знаходити схожі новини. Введіть теги через кому." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tags"
                      value={formData.tags.join(", ")}
                      onChange={(e) =>
                        handleChange(
                          "tags",
                          e.target.value.split(", ").filter((tag) => tag.trim() !== ""),
                        )
                      }
                      placeholder="Введіть теги через кому, наприклад: музика, концерт, фестиваль"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Крок 4: Публікація */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Налаштування публікації</CardTitle>
              <CardDescription>Вкажіть дату публікації та налаштуйте видимість новини на сайті.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="publish_date">Дата публікації</Label>
                    <HelpTooltip content="Дата, коли новина буде опублікована на сайті." />
                  </div>
                  <div className="flex items-center">
                    <Label htmlFor="publish_date">Дата публікації</Label>
                    <HelpTooltip content="Дата, коли новина буде опублікована на сайті." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => handleChange("publish_date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleChange("featured", checked)}
                    />
                    <div>
                      <Label htmlFor="featured" className="flex items-center">
                        Рекомендована новина
                        <HelpTooltip content="Рекомендовані новини відображаються на головній сторінці та в спеціальних блоках." />
                      </Label>
                      <p className="text-sm text-muted-foreground">Відображати на головній сторінці</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleChange("published", checked)}
                    />
                    <div>
                      <Label htmlFor="published" className="flex items-center">
                        Опублікована
                      </Label>
                      <HelpTooltip content="Якщо вимкнено, новина буде збережена як чернетка і не буде видима на сайті." />
                      <p className="text-sm text-muted-foreground">Зробити новину видимою на сайті</p>
                    </div>
                  </div>
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/news")}>
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

