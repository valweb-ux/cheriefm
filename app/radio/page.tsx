export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { RadioPlayer } from "@/components/radio/radio-player"

export default async function RadioPage() {
  const supabase = createClient()

  // Отримуємо інформацію про радіо
  const { data: radioInfo } = await supabase
    .from("radio_info")
    .select("*")
    .single()
    .catch(() => ({ data: null }))

  // Отримуємо радіо-шоу
  const { data: shows } = await supabase.from("radio_shows").select("*").order("title").limit(6)

  // Отримуємо поточну програму
  const { data: currentShow } = await supabase.from("radio_shows").select("*").limit(1).single()

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Радіо</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Слухати онлайн</h2>
          <Card>
            <CardContent className="p-6">
              {/* Використовуємо клієнтський компонент для плеєра */}
              <RadioPlayer
                streamUrl={radioInfo?.stream_url || "https://online.cheriefm.ua/cheriefm"}
                title={radioInfo?.title || "Chérie FM"}
                currentTrack={radioInfo?.current_track || "Зараз грає музика"}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Зараз в ефірі</h2>
          <Card>
            <CardContent className="p-6">
              {currentShow ? (
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={currentShow.image || "/placeholder.svg?height=100&width=100"}
                      alt={currentShow.title}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{currentShow.title}</h3>
                      {currentShow.host && <p className="text-sm text-muted-foreground">Ведучий: {currentShow.host}</p>}
                      {currentShow.schedule && (
                        <p className="text-sm text-muted-foreground">
                          {typeof currentShow.schedule === "string"
                            ? currentShow.schedule
                            : Array.isArray(currentShow.schedule)
                              ? currentShow.schedule.join(", ")
                              : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  {currentShow.description && <p className="mt-4">{currentShow.description}</p>}
                </div>
              ) : (
                <p className="text-muted-foreground">Інформація про поточну програму недоступна</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Наші програми</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shows && shows.length > 0 ? (
          shows.map((show) => (
            <Link href={`/radio/shows/${show.id}`} key={show.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={show.image || "/placeholder.svg?height=300&width=500"}
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold">{show.title}</h3>
                  {show.host && <p className="text-sm text-muted-foreground mt-1">Ведучий: {show.host}</p>}
                  {show.schedule && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {typeof show.schedule === "string"
                        ? show.schedule
                        : Array.isArray(show.schedule)
                          ? show.schedule.join(", ")
                          : ""}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">Немає програм</div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/radio/shows" className="text-primary hover:underline">
          Переглянути всі програми
        </Link>
      </div>
    </main>
  )
}

