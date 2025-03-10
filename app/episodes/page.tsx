export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function EpisodesPage() {
  const supabase = createClient()

  // Отримуємо епізоди з бази даних
  const { data: episodes, error } = await supabase
    .from("episodes")
    .select("*, programs(*)")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні епізодів" } }))

  if (error) {
    console.error("Error fetching episodes:", error)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Епізоди</h1>

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
                  <h2 className="text-xl font-bold">{episode.title}</h2>
                  {episode.programs && <p className="text-sm text-muted-foreground mt-1">{episode.programs.title}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(episode.published_at || "").toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2">{episode.description || "Немає опису"}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">Немає епізодів</div>
        )}
      </div>
    </main>
  )
}

