export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default async function ArtistsPage() {
  const supabase = createClient()

  // Отримуємо всіх артистів
  const { data: artists, error } = await supabase
    .from("artists")
    .select("*")
    .order("name")
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні артистів" } }))

  // Якщо таблиця ще не створена, використовуємо тестові дані
  const artistsList = artists || [
    { id: "1", name: "Виконавець 1", image_url: "/placeholder.svg?height=300&width=300", genre: "Поп" },
    { id: "2", name: "Виконавець 2", image_url: "/placeholder.svg?height=300&width=300", genre: "Рок" },
    { id: "3", name: "Виконавець 3", image_url: "/placeholder.svg?height=300&width=300", genre: "Електронна" },
    { id: "4", name: "Виконавець 4", image_url: "/placeholder.svg?height=300&width=300", genre: "Хіп-хоп" },
    { id: "5", name: "Виконавець 5", image_url: "/placeholder.svg?height=300&width=300", genre: "Джаз" },
    { id: "6", name: "Виконавець 6", image_url: "/placeholder.svg?height=300&width=300", genre: "Класична" },
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Виконавці</h1>

      <div className="mb-8 max-w-md">
        <Input placeholder="Пошук виконавців..." />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artistsList.map((artist) => (
          <Link href={`/music/artists/${artist.id}`} key={artist.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={artist.image_url || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{artist.name}</h3>
                {artist.genre && <p className="text-sm text-muted-foreground mt-1">{artist.genre}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

