export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = createClient()

  // Отримуємо статистику з бази даних
  const { data: episodesCount, count } = await supabase
    .from("episodes")
    .select("id", { count: "exact", head: true })
    .catch(() => ({ data: null, count: 0 }))

  const { data: pagesCount, count: pagesCountNum } = await supabase
    .from("pages")
    .select("id", { count: "exact", head: true })
    .catch(() => ({ data: null, count: 0 }))

  // Отримуємо останні епізоди
  const { data: latestEpisodes } = await supabase
    .from("episodes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
    .catch(() => ({ data: [] }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Панель адміністратора</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всього епізодів</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всього сторінок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagesCountNum || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Активні користувачі</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Останні епізоди</CardTitle>
        </CardHeader>
        <CardContent>
          {latestEpisodes && latestEpisodes.length > 0 ? (
            <div className="space-y-4">
              {latestEpisodes.map((episode) => (
                <div key={episode.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{episode.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(episode.created_at || "").toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm">
                    {episode.published ? (
                      <span className="text-green-600">Опубліковано</span>
                    ) : (
                      <span className="text-gray-500">Чернетка</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Немає епізодів</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

