import { getPlaylistBySlug, getPlaylistTracks } from "@/lib/services/playlists-service"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Heart, Share2, Music, Shuffle } from "lucide-react"
import { TrackCard } from "@/components/music/track-card"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const playlist = await getPlaylistBySlug(params.slug).catch(() => null)

  if (!playlist) {
    return {
      title: "Плейлист не знайдено | Chérie FM",
      description: "Плейлист не знайдено",
    }
  }

  return {
    title: `${playlist.title} | Chérie FM`,
    description: playlist.description || `Слухайте плейлист ${playlist.title} на Chérie FM`,
  }
}

export default async function PlaylistPage({ params }: { params: { slug: string } }) {
  const playlist = await getPlaylistBySlug(params.slug).catch(() => null)

  if (!playlist) {
    notFound()
  }

  const tracks = await getPlaylistTracks(playlist.id)

  // Обчислюємо загальну тривалість
  const totalDuration = tracks.reduce((acc, track) => acc + (track.duration || 0), 0)

  // Форматування тривалості
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours} год ${minutes} хв`
    }
    return `${minutes} хв`
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Обкладинка плейлиста */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square rounded-md overflow-hidden shadow-lg">
            {playlist.cover_url ? (
              <Image
                src={playlist.cover_url || "/placeholder.svg"}
                alt={playlist.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Інформація про плейлист */}
        <div className="flex-1">
          <div className="flex flex-col h-full">
            <div>
              <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span>{tracks.length} треків</span>
                <span>•</span>
                <span>{formatDuration(totalDuration)}</span>
                <span>•</span>
                <span>Створено {formatDate(playlist.created_at)}</span>
              </div>

              {playlist.description && <p className="text-muted-foreground mb-6">{playlist.description}</p>}
            </div>

            {/* Кнопки дій */}
            <div className="flex gap-2 mb-6">
              <Button className="gap-2">
                <Play size={18} />
                Відтворити все
              </Button>
              <Button variant="outline" className="gap-2">
                <Shuffle size={18} />
                Перемішати
              </Button>
              <Button variant="outline" size="icon">
                <Heart size={18} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Список треків */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Треки</h2>

        {tracks.length > 0 ? (
          <div className="grid gap-2">
            {tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist}
                cover_url={track.cover_url}
                duration={track.duration}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">У цьому плейлисті ще немає треків</p>
          </div>
        )}
      </div>
    </div>
  )
}

