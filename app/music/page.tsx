export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { MusicPlayer } from "@/components/music/music-player"
import { FeaturedArtists } from "@/components/music/featured-artists"
import { RecommendedPlaylists } from "@/components/music/recommended-playlists"

export default async function MusicPage() {
  const supabase = createClient()

  // Отримуємо популярні треки
  const { data: popularTracks, error: tracksError } = await supabase
    .from("tracks")
    .select("*")
    .order("plays", { ascending: false })
    .limit(5)
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні популярних треків" } }))

  // Отримуємо рекомендовані артисти
  const { data: recommendedArtists, error: artistsError } = await supabase
    .from("artists")
    .select("*")
    .limit(6)
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні рекомендованих артистів" } }))

  // Отримуємо рекомендовані плейлисти
  const { data: recommendedPlaylists, error: playlistsError } = await supabase
    .from("playlists")
    .select("*")
    .limit(3)
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні рекомендованих плейлистів" } }))

  // Якщо таблиці ще не створені, використовуємо тестові дані
  const tracks = popularTracks || [
    {
      id: "1",
      title: "Пісня 1",
      artist_name: "Виконавець 1",
      album: "Альбом 1",
      duration: 180,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song1.mp3",
    },
    {
      id: "2",
      title: "Пісня 2",
      artist_name: "Виконавець 2",
      album: "Альбом 2",
      duration: 210,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song2.mp3",
    },
    {
      id: "3",
      title: "Пісня 3",
      artist_name: "Виконавець 3",
      album: "Альбом 3",
      duration: 240,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song3.mp3",
    },
    {
      id: "4",
      title: "Пісня 4",
      artist_name: "Виконавець 4",
      album: "Альбом 4",
      duration: 195,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song4.mp3",
    },
    {
      id: "5",
      title: "Пісня 5",
      artist_name: "Виконавець 5",
      album: "Альбом 5",
      duration: 225,
      image_url: "/placeholder.svg?height=300&width=300",
      audio_url: "https://example.com/song5.mp3",
    },
  ]

  const artists = recommendedArtists || [
    { id: "1", name: "Виконавець 1", image_url: "/placeholder.svg?height=300&width=300", genre: "Поп" },
    { id: "2", name: "Виконавець 2", image_url: "/placeholder.svg?height=300&width=300", genre: "Рок" },
    { id: "3", name: "Виконавець 3", image_url: "/placeholder.svg?height=300&width=300", genre: "Електронна" },
    { id: "4", name: "Виконавець 4", image_url: "/placeholder.svg?height=300&width=300", genre: "Хіп-хоп" },
    { id: "5", name: "Виконавець 5", image_url: "/placeholder.svg?height=300&width=300", genre: "Джаз" },
    { id: "6", name: "Виконавець 6", image_url: "/placeholder.svg?height=300&width=300", genre: "Класична" },
  ]

  const playlists = recommendedPlaylists || [
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
  ]

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Музика</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Популярні треки</h2>
          <Card>
            <CardContent className="p-6">
              <MusicPlayer tracks={tracks} />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Рекомендовані плейлисти</h2>
          <RecommendedPlaylists playlists={playlists} />
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Популярні виконавці</h2>
      <FeaturedArtists artists={artists} />

      <div className="mt-8 text-center">
        <Link href="/music/artists" className="text-primary hover:underline">
          Переглянути всіх виконавців
        </Link>
      </div>
    </main>
  )
}

