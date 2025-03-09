export const dynamic = "force-dynamic"

import { RadioPreview } from "@/components/home/radio-preview"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = createClient()

  // Отримуємо останні епізоди
  const { data: latestEpisodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(6)

  // Отримуємо останні новини
  const { data: latestNews } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3)

  return (
    <main className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Chérie FM</h1>
        <RadioPreview />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Останні епізоди</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestEpisodes && latestEpisodes.length > 0 ? (
            latestEpisodes.map((episode) => (
              <div key={episode.id} className="border rounded-lg overflow-hidden">
                <img
                  src={episode.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={episode.title || ""}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{episode.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{episode.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">Немає епізодів</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Останні новини</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {latestNews && latestNews.length > 0 ? (
            latestNews.map((news) => (
              <div key={news.id} className="border rounded-lg overflow-hidden">
                <img
                  src={news.image || "/placeholder.svg?height=200&width=400"}
                  alt={news.title || ""}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{news.excerpt}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">Немає новин</div>
          )}
        </div>
      </section>
    </main>
  )
}

