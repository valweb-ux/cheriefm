"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Save, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { PageSeoData } from "@/types/analytics.types"
import { updatePageSeoDataAction, createPageSeoDataAction } from "@/app/admin/analytics/actions"

export function PageSeoManager() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pages, setPages] = useState<PageSeoData[]>([])
  const [selectedPage, setSelectedPage] = useState<PageSeoData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Форма для редагування
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    canonical_url: "",
    no_index: false,
    no_follow: false,
  })

  // Форма для створення
  const [newPageData, setNewPageData] = useState({
    page_type: "page",
    page_path: "",
    title: "",
    description: "",
    no_index: false,
    no_follow: false,
  })

  // Завантаження даних
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("/api/analytics/page-seo")

        if (!response.ok) {
          throw new Error("Помилка при завантаженні даних")
        }

        const data = await response.json()
        setPages(data.data || [])
      } catch (error) {
        console.error("Error fetching page SEO data:", error)
        toast({
          title: "Помилка",
          description: error instanceof Error ? error.message : "Не вдалося завантажити дані",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [toast])

  // Вибір сторінки для редагування
  const handleSelectPage = (page: PageSeoData) => {
    setSelectedPage(page)
    setFormData({
      title: page.title || "",
      description: page.description || "",
      keywords: page.keywords || "",
      og_title: page.og_title || "",
      og_description: page.og_description || "",
      og_image: page.og_image || "",
      twitter_title: page.twitter_title || "",
      twitter_description: page.twitter_description || "",
      twitter_image: page.twitter_image || "",
      canonical_url: page.canonical_url || "",
      no_index: page.no_index,
      no_follow: page.no_follow,
    })
  }

  // Зміна полів форми
  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Зміна полів форми для нової сторінки
  const handleNewPageChange = (field: string, value: string | boolean) => {
    setNewPageData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Збереження змін
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPage) return

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Додаємо всі поля до FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "true" : "false")
        } else if (value) {
          formDataObj.append(key, value as string)
        }
      })

      const result = await updatePageSeoDataAction(selectedPage.id, formDataObj)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })

        // Оновлюємо список
        const updatedPages = pages.map((page) =>
          page.id === selectedPage.id ? { ...page, ...formData, updated_at: new Date().toISOString() } : page,
        )
        setPages(updatedPages)

        router.refresh()
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating page SEO data:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося зберегти дані",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Створення нової сторінки
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Додаємо всі поля до FormData
      Object.entries(newPageData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "true" : "false")
        } else if (value) {
          formDataObj.append(key, value as string)
        }
      })

      const result = await createPageSeoDataAction(formDataObj)

      if (result.success) {
        toast({
          title: "Успішно",
          description: result.message,
        })

        // Оновлюємо сторінку для оновлення списку
        router.refresh()

        // Закриваємо діалог
        setShowAddDialog(false)

        // Скидаємо форму
        setNewPageData({
          page_type: "page",
          page_path: "",
          title: "",
          description: "",
          no_index: false,
          no_follow: false,
        })
      } else {
        toast({
          title: "Помилка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating page SEO data:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося створити дані",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Фільтрація сторінок за пошуковим запитом
  const filteredPages = pages.filter((page) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      page.page_type.toLowerCase().includes(searchLower) ||
      (page.page_path && page.page_path.toLowerCase().includes(searchLower)) ||
      (page.title && page.title.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Пошук сторінок..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Додати сторінку
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Додати SEO для сторінки</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreatePage} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="page_type">Тип сторінки</Label>
                <Select
                  value={newPageData.page_type}
                  onValueChange={(value) => handleNewPageChange("page_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть тип сторінки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Головна</SelectItem>
                    <SelectItem value="news">Новини</SelectItem>
                    <SelectItem value="music">Музика</SelectItem>
                    <SelectItem value="radio">Радіо</SelectItem>
                    <SelectItem value="page">Сторінка</SelectItem>
                    <SelectItem value="artist">Виконавець</SelectItem>
                    <SelectItem value="track">Трек</SelectItem>
                    <SelectItem value="playlist">Плейлист</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="page_path">Шлях сторінки</Label>
                <Input
                  id="page_path"
                  value={newPageData.page_path}
                  onChange={(e) => handleNewPageChange("page_path", e.target.value)}
                  placeholder="/music/artists/madonna"
                />
                <p className="text-xs text-muted-foreground">
                  Залиште порожнім для типу сторінки (наприклад, для всіх новин)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={newPageData.title}
                  onChange={(e) => handleNewPageChange("title", e.target.value)}
                  placeholder="Заголовок сторінки"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={newPageData.description}
                  onChange={(e) => handleNewPageChange("description", e.target.value)}
                  placeholder="Опис сторінки"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="no_index"
                  checked={newPageData.no_index}
                  onCheckedChange={(value) => handleNewPageChange("no_index", value)}
                />
                <Label htmlFor="no_index">Не індексувати</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="no_follow"
                  checked={newPageData.no_follow}
                  onCheckedChange={(value) => handleNewPageChange("no_follow", value)}
                />
                <Label htmlFor="no_follow">Не слідувати за посиланнями</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Скасувати
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Збереження...
                    </>
                  ) : (
                    "Створити"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="col-span-full py-8 text-center">
            <p className="text-muted-foreground">Не знайдено жодної сторінки</p>
          </div>
        ) : (
          filteredPages.map((page) => (
            <Card
              key={page.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedPage?.id === page.id ? "border-primary" : ""
              }`}
              onClick={() => handleSelectPage(page)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{page.title || `${page.page_type} ${page.page_path || ""}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Тип:</span>
                    <span className="text-muted-foreground">{page.page_type}</span>
                  </div>
                  {page.page_path && (
                    <div className="flex justify-between">
                      <span className="font-medium">Шлях:</span>
                      <span className="text-muted-foreground">{page.page_path}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Індексація:</span>
                    <span className="text-muted-foreground">{page.no_index ? "Вимкнена" : "Увімкнена"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Оновлено:</span>
                    <span className="text-muted-foreground">{new Date(page.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedPage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Редагування SEO для {selectedPage.page_type}
              {selectedPage.page_path && ` - ${selectedPage.page_path}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Основні</TabsTrigger>
                  <TabsTrigger value="social">Соціальні мережі</TabsTrigger>
                  <TabsTrigger value="advanced">Розширені</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Заголовок сторінки"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Опис</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Опис сторінки"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Рекомендована довжина: 150-160 символів</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Ключові слова</Label>
                    <Textarea
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => handleChange("keywords", e.target.value)}
                      placeholder="радіо, музика, новини"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Розділяйте ключові слова комами</p>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="og_title">Open Graph заголовок</Label>
                    <Input
                      id="og_title"
                      value={formData.og_title}
                      onChange={(e) => handleChange("og_title", e.target.value)}
                      placeholder="Заголовок для Facebook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_description">Open Graph опис</Label>
                    <Textarea
                      id="og_description"
                      value={formData.og_description}
                      onChange={(e) => handleChange("og_description", e.target.value)}
                      placeholder="Опис для Facebook"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_image">Open Graph зображення</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image}
                      onChange={(e) => handleChange("og_image", e.target.value)}
                      placeholder="URL зображення для Facebook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_title">Twitter заголовок</Label>
                    <Input
                      id="twitter_title"
                      value={formData.twitter_title}
                      onChange={(e) => handleChange("twitter_title", e.target.value)}
                      placeholder="Заголовок для Twitter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_description">Twitter опис</Label>
                    <Textarea
                      id="twitter_description"
                      value={formData.twitter_description}
                      onChange={(e) => handleChange("twitter_description", e.target.value)}
                      placeholder="Опис для Twitter"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_image">Twitter зображення</Label>
                    <Input
                      id="twitter_image"
                      value={formData.twitter_image}
                      onChange={(e) => handleChange("twitter_image", e.target.value)}
                      placeholder="URL зображення для Twitter"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="canonical_url">Канонічний URL</Label>
                    <Input
                      id="canonical_url"
                      value={formData.canonical_url}
                      onChange={(e) => handleChange("canonical_url", e.target.value)}
                      placeholder="https://cheriefm.ua/canonical-path"
                    />
                    <p className="text-xs text-muted-foreground">Залиште порожнім для використання поточного URL</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="no_index"
                      checked={formData.no_index}
                      onCheckedChange={(value) => handleChange("no_index", value)}
                    />
                    <Label htmlFor="no_index">Не індексувати</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="no_follow"
                      checked={formData.no_follow}
                      onCheckedChange={(value) => handleChange("no_follow", value)}
                    />
                    <Label htmlFor="no_follow">Не слідувати за посиланнями</Label>
                  </div>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="mt-4" disabled={saving}>
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
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

