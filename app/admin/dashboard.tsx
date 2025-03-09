"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, Radio, Music, Settings, Image, Search, Calendar, Users, BarChart } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Реалізація пошуку
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Панель керування</h1>
          <p className="text-muted-foreground">Ласкаво просимо до адміністративної панелі Chérie FM</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Пошук контенту..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Новини</CardTitle>
            <CardDescription className="text-primary-foreground/80">Всього публікацій</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Програми</CardTitle>
            <CardDescription>Активні радіопрограми</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Музика</CardTitle>
            <CardDescription>Треки в бібліотеці</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Медіа</CardTitle>
            <CardDescription>Файлів у бібліотеці</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Швидкі дії</CardTitle>
              <CardDescription>Створення нового контенту</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/news/create")}
              >
                <FileText className="h-6 w-6" />
                <span>Створити новину</span>
              </Button>

              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/programs/create")}
                variant="outline"
              >
                <Radio className="h-6 w-6" />
                <span>Створити програму</span>
              </Button>

              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/music/tracks/new")}
                variant="outline"
              >
                <Music className="h-6 w-6" />
                <span>Додати трек</span>
              </Button>

              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/pages/create")}
                variant="outline"
              >
                <FileText className="h-6 w-6" />
                <span>Створити сторінку</span>
              </Button>

              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/media")}
                variant="outline"
              >
                <Image className="h-6 w-6" />
                <span>Завантажити медіа</span>
              </Button>

              <Button
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/admin/schedule/create")}
                variant="outline"
              >
                <Calendar className="h-6 w-6" />
                <span>Додати в розклад</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Останні оновлення</CardTitle>
              <CardDescription>Нещодавно змінений контент</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="news">Новини</TabsTrigger>
                  <TabsTrigger value="programs">Програми</TabsTrigger>
                  <TabsTrigger value="music">Музика</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Нова музична програма</div>
                      <div className="text-sm text-muted-foreground">Оновлено 2 години тому</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/admin/news/edit/1")}>
                      Редагувати
                    </Button>
                  </div>

                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Інтерв'ю з відомим виконавцем</div>
                      <div className="text-sm text-muted-foreground">Оновлено 5 годин тому</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/admin/news/edit/2")}>
                      Редагувати
                    </Button>
                  </div>

                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Новий трек у ротації</div>
                      <div className="text-sm text-muted-foreground">Оновлено вчора</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/admin/music/tracks/3")}>
                      Редагувати
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="news" className="space-y-4">
                  {/* Вміст для вкладки "Новини" */}
                </TabsContent>

                <TabsContent value="programs" className="space-y-4">
                  {/* Вміст для вкладки "Програми" */}
                </TabsContent>

                <TabsContent value="music" className="space-y-4">
                  {/* Вміст для вкладки "Музика" */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Швидка навігація</CardTitle>
              <CardDescription>Основні розділи</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/news")}>
                <FileText className="mr-2 h-4 w-4" />
                Новини
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/programs")}>
                <Radio className="mr-2 h-4 w-4" />
                Програми
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/admin/music/tracks")}
              >
                <Music className="mr-2 h-4 w-4" />
                Музика
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/schedule")}>
                <Calendar className="mr-2 h-4 w-4" />
                Розклад
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/media")}>
                <Image className="mr-2 h-4 w-4" />
                Медіа-бібліотека
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/hosts")}>
                <Users className="mr-2 h-4 w-4" />
                Ведучі
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/analytics")}>
                <BarChart className="mr-2 h-4 w-4" />
                Аналітика
              </Button>

              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Налаштування
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Підказки</CardTitle>
              <CardDescription>Корисна інформація</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-3 bg-muted/50">
                <h3 className="font-medium mb-1">Як додати новину трьома мовами?</h3>
                <p className="text-sm text-muted-foreground">
                  Використовуйте вкладки з мовами при створенні новини. Ви можете скопіювати текст з однієї мови на іншу
                  за допомогою кнопки "Копіювати".
                </p>
              </div>

              <div className="border rounded-md p-3 bg-muted/50">
                <h3 className="font-medium mb-1">Як завантажити зображення?</h3>
                <p className="text-sm text-muted-foreground">
                  Перейдіть до розділу "Медіа-бібліотека" та натисніть кнопку "Завантажити". Після завантаження ви
                  зможете використовувати зображення в новинах та інших матеріалах.
                </p>
              </div>

              <Button variant="link" className="px-0" onClick={() => router.push("/admin/help")}>
                Переглянути всі підказки
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

