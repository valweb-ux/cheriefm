export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function RadioShowsPage() {
  const supabase = createClient()

  // Отримуємо радіо-шоу з бази даних
  const { data: shows, error } = await supabase.from("radio_shows").select("*").order("title")

  if (error) {
    console.error("Error fetching radio shows:", error)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Радіо-шоу</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shows && shows.length > 0 ? (
          shows.map((show) => (
            <Link href={`/radio/shows/${show.id}`} key={show.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={show.image || "/placeholder.svg?height=300&width=500"}
                    alt={show.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold">{show.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">Ведучий: {show.host || "Не вказано"}</p>
                  {show.schedule && typeof show.schedule === "string" && (
                    <p className="text-sm mt-2">Розклад: {show.schedule}</p>
                  )}
                  {show.schedule && Array.isArray(show.schedule) && (
                    <p className="text-sm mt-2">Розклад: {show.schedule.join(", ")}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">Немає радіо-шоу</div>
        )}
      </div>
    </main>
  )
}

