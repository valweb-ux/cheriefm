import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentContent } from "@/components/admin/recent-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Newspaper, Radio, Music, FileText, Settings, Image } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель адміністратора</h1>
        <p className="text-muted-foreground">Керуйте контентом сайту Шері ФМ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новини</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Управління новинами</div>
              <p className="text-xs text-muted-foreground">Створюйте та редагуйте новини, керуйте категоріями</p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/news/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Створити новину
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/news">Переглянути всі новини</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Програми</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Радіопрограми</div>
              <p className="text-xs text-muted-foreground">Керуйте радіопрограмами та розкладом ефіру</p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/programs/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Створити програму
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/programs">Переглянути всі програми</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Музика</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Музична бібліотека</div>
              <p className="text-xs text-muted-foreground">Додавайте треки, виконавців та плейлисти</p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/music/tracks/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Додати трек
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/music/artists">Переглянути виконавців</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Медіафайли</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Медіабібліотека</div>
              <p className="text-xs text-muted-foreground">
                Завантажуйте та керуйте зображеннями та іншими медіафайлами
              </p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/media">
                    <Plus className="mr-2 h-4 w-4" />
                    Завантажити медіафайл
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/media">Переглянути медіабібліотеку</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сторінки</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Статичні сторінки</div>
              <p className="text-xs text-muted-foreground">Створюйте та редагуйте статичні сторінки сайту</p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/pages/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Створити сторінку
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/pages">Переглянути всі сторінки</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Налаштування</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Налаштування сайту</div>
              <p className="text-xs text-muted-foreground">Змінюйте загальні налаштування, SEO та інтеграції</p>
              <div className="flex flex-col space-y-2">
                <Button asChild size="sm">
                  <Link href="/admin/settings">Загальні налаштування</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/settings/theme">Налаштування дизайну</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Огляд</TabsTrigger>
          <TabsTrigger value="recent">Останні зміни</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

