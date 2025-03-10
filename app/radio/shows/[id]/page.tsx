export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

export default async function RadioShowDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Отримуємо радіо-шоу з бази даних
  const { data: show, error } = await supabase
    .from("radio_shows")
    .select("*")
    .eq("id", params.id)
    .single()
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні радіо-шоу" } }))

  if (error) {
    console.error("Error fetching radio show:", error)
  }

  // Отримуємо епізоди цього шоу
  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select("*")
    .eq("program_id", params.id)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні епізодів" } }))

  if (episodesError) {
    console.error("Error fetching episodes:", episodesError)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link href="/radio/shows">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до всіх шоу
        </Button>
      </Link>

      {show ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <img
              src={show.image || "/placeholder.svg?height=400&width=400"}
              alt={show.title || ""}
              className="w-full rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{show.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {show.host && (
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Ведучий: {show.host}</span>
                </div>
              )}

              {show.schedule && (
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Розклад:{" "}
                    {typeof show.schedule === "string"
                      ? show.schedule
                      : Array.isArray(show.schedule)
                        ? show.schedule.join(", ")
                        : ""}
                  </span>
                </div>
              )}

              {show.duration && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Тривалість: {show.duration} хв.</span>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <p>{show.description || "Немає опису"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">Шоу не знайдено</div>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-6">Епізоди</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {episodes && episodes.length > 0 ? (
          episodes.map((episode) => (
            <Link href={`/episodes/${episode.id}`} key={episode.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={episode.image_url || "/placeholder.svg?height=300&width=500"}
                    alt={episode.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">{episode.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(episode.published_at || "").toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2">{episode.description || "Немає опису"}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">Немає епізодів для цього шоу</div>
        )}
      </div>
    </main>
  )
}

