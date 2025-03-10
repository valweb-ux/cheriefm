export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default async function PlaylistsPage() {
  const supabase = createClient()

  // Отримуємо всі плейлисти
  const { data: playlists, error } = await supabase
    .from("playlists")
    .select("*")
    .order("title")
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні плейлистів" } }))

  // Якщо таблиця ще не створена, використовуємо тестові дані
  const playlistsList = playlists || [
    {
      id: "1",
      title: "Плейлист 1",
      description: "Опис плейлиста 1",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 15,
    },
    {
      id: "2",
      title: "Плейлист 2",
      description: "Опис плейлиста 2",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 20,
    },
    {
      id: "3",
      title: "Плейлист 3",
      description: "Опис плейлиста 3",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 12,
    },
    {
      id: "4",
      title: "Плейлист 4",
      description: "Опис плейлиста 4",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 8,
    },
    {
      id: "5",
      title: "Плейлист 5",
      description: "Опис плейлиста 5",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 25,
    },
    {
      id: "6",
      title: "Плейлист 6",
      description: "Опис плейлиста 6",
      image_url: "/placeholder.svg?height=300&width=300",
      tracks_count: 18,
    },
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Плейлисти</h1>

      <div className="mb-8 max-w-md">
        <Input placeholder="Пошук плейлистів..." />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {playlistsList.map((playlist) => (
          <Link href={`/music/playlists/${playlist.id}`} key={playlist.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={playlist.image_url || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">{playlist.title}</h3>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{playlist.description}</p>
                )}
                {playlist.tracks_count && (
                  <p className="text-xs text-muted-foreground mt-2">{playlist.tracks_count} треків</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

