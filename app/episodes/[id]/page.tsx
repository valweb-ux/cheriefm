export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default async function EpisodeDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Отримуємо епізод з бази даних
  const { data: episode, error } = await supabase.from("episodes").select("*, programs(*)").eq("id", params.id).single()

  if (error) {
    console.error("Error fetching episode:", error)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link href="/episodes">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до всіх епізодів
        </Button>
      </Link>

      {episode ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <img
              src={episode.image_url || "/placeholder.svg?height=400&width=400"}
              alt={episode.title || ""}
              className="w-full rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{episode.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {episode.programs && (
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Програма: {episode.programs.title}</span>
                </div>
              )}

              {episode.published_at && (
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Опубліковано: {new Date(episode.published_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <p>{episode.description || "Немає опису"}</p>
            </div>

            {episode.audio_url && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Слухати</h2>
                <audio controls className="w-full">
                  <source src={episode.audio_url} type="audio/mpeg" />
                  Ваш браузер не підтримує аудіо-елемент.
                </audio>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">Епізод не знайдено</div>
      )}
    </main>
  )
}

