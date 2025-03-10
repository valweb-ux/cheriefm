export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MusicPlayer } from "@/components/music/music-player"

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const supabase = createClient()

  // Отримуємо інформацію про плейлист
  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", params.id)
    .single()
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні інформації про плейлист" } }))

  // Отримуємо треки плейлиста
  const { data: playlistTracks, error: tracksError } = await supabase
    .from("playlist_tracks")
    .select("*, track:track_id(*)")
    .eq("playlist_id", params.id)
    .order("position")
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні треків плейлиста" } }))

  // Якщо плейлист не знайдений, повертаємо 404
  if (!playlist && !playlistError) {
    notFound()
  }

  // Якщо таблиці ще не створені, використовуємо тестові дані
  const playlistData = playlist || {
    id: params.id,
    title: "Плейлист " + params.id,
    description: "Опис плейлиста " + params.id,
    image_url: "/placeholder.svg?height=300&width=300",
    tracks_count: 3,
  }

  // Перетворюємо дані треків у формат, який очікує MusicPlayer
  const tracks = playlistTracks
    ? playlistTracks.map((pt) => pt.track)
    : [
        {
          id: "1",
          title: "Пісня 1",
          artist: "Виконавець 1",
          album: "Альбом 1",
          duration: 180,
          image_url: "/placeholder.svg?height=300&width=300",
          audio_url: "https://example.com/song1.mp3",
        },
        {
          id: "2",
          title: "Пісня 2",
          artist: "Виконавець 2",
          album: "Альбом 2",
          duration: 210,
          image_url: "/placeholder.svg?height=300&width=300",
          audio_url: "https://example.com/song2.mp3",
        },
        {
          id: "3",
          title: "Пісня 3",
          artist: "Виконавець 3",
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
            src={playlistData.image_url || "/placeholder.svg"}
            alt={playlistData.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{playlistData.title}</h1>
          {playlistData.description && <p className="text-lg text-muted-foreground mb-4">{playlistData.description}</p>}
          {playlistData.tracks_count && <p className="text-muted-foreground">{playlistData.tracks_count} треків</p>}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Треки</h2>
      <Card>
        <CardContent className="p-6">
          <MusicPlayer tracks={tracks} />
        </CardContent>
      </Card>

      <div className="mt-12">
        <Link href="/music/playlists" className="text-primary hover:underline">
          ← Назад до плейлистів
        </Link>
      </div>
    </main>
  )
}

