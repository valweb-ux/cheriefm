export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MusicPlayer } from "@/components/music/music-player"

interface ArtistPageProps {
  params: {
    id: string
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const supabase = createClient()

  // Отримуємо інформацію про артиста
  const { data: artist, error: artistError } = await supabase
    .from("artists")
    .select("*")
    .eq("id", params.id)
    .single()
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні інформації про артиста" } }))

  // Отримуємо треки артиста
  const { data: tracks, error: tracksError } = await supabase
    .from("tracks")
    .select("*")
    .eq("artist", artist?.name || "")
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні треків артиста" } }))

  // Якщо артист не знайдений, повертаємо 404
  if (!artist && !artistError) {
    notFound()
  }

  // Якщо таблиці ще не створені, використовуємо тестові дані
  const artistData = artist || {
    id: params.id,
    name: "Виконавець " + params.id,
    image_url: "/placeholder.svg?height=300&width=300",
    genre: "Поп",
    bio: "Біографія виконавця " + params.id,
  }

  const tracksList = tracks || [
    {
      id: "1",
      title: "Пісня 1",
      artist: artistData.name,
      album: "Альбом 1",
      duration: 180,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song1.mp3",
    },
    {
      id: "2",
      title: "Пісня 2",
      artist: artistData.name,
      album: "Альбом 2",
      duration: 210,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song2.mp3",
    },
    {
      id: "3",
      title: "Пісня 3",
      artist: artistData.name,
      album: "Альбом 3",
      duration: 240,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song3.mp3",
    },
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3">
          <img
            src={artistData.image_url || "/placeholder.svg"}
            alt={artistData.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{artistData.name}</h1>
          {artistData.genre && <p className="text-lg text-muted-foreground mb-4">{artistData.genre}</p>}
          {artistData.bio && (
            <div className="prose max-w-none">
              <p>{artistData.bio}</p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Популярні треки</h2>
      <Card>
        <CardContent className="p-6">
          <MusicPlayer tracks={tracksList} />
        </CardContent>
      </Card>

      <div className="mt-12">
        <Link href="/music/artists" className="text-primary hover:underline">
          ← Назад до виконавців
        </Link>
      </div>
    </main>
  )
}

