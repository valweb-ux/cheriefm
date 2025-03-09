import { getTrackBySlug } from "@/lib/services/tracks-service"
import { getArtistById } from "@/lib/services/artists-service"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Heart, Share2, Clock, Music } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const track = await getTrackBySlug(params.slug).catch(() => null)

  if (!track) {
    return {
      title: "Трек не знайдено | Chérie FM",
      description: "Трек не знайдено",
    }
  }

  return {
    title: `${track.title} - ${track.artists.name} | Chérie FM`,
    description: track.description || `Слухайте ${track.title} від ${track.artists.name} на Chérie FM`,
  }
}

export default async function TrackPage({ params }: { params: { slug: string } }) {
  const track = await getTrackBySlug(params.slug).catch(() => null)

  if (!track) {
    notFound()
  }

  const artist = await getArtistById(track.artist_id)

  // Форматування тривалості
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Обкладинка треку */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square rounded-md overflow-hidden shadow-lg">
            {track.cover_url ? (
              <Image
                src={track.cover_url || "/placeholder.svg"}
                alt={track.title}
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

        {/* Інформація про трек */}
        <div className="flex-1">
          <div className="flex flex-col h-full">
            <div>
              <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
              <Link
                href={`/music/artists/${artist.slug || artist.id}`}
                className="text-xl text-primary hover:underline mb-4 block"
              >
                {artist.name}
              </Link>

              {track.album && <p className="text-muted-foreground mb-2">Альбом: {track.album}</p>}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDuration(track.duration)}
                </span>
                <span>•</span>
                <span>{formatDate(track.created_at)}</span>
                {track.genre && (
                  <>
                    <span>•</span>
                    <Link href={`/music/tracks?genre=${track.genre}`} className="hover:text-primary">
                      {track.genre}
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Кнопки дій */}
            <div className="flex gap-2 mb-6">
              <Button className="gap-2">
                <Play size={18} />
                Відтворити
              </Button>
              <Button variant="outline" size="icon">
                <Heart size={18} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 size={18} />
              </Button>
            </div>

            {/* Опис треку */}
            {track.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Про трек</h2>
                <p className="text-muted-foreground">{track.description}</p>
              </div>
            )}

            {/* Статистика */}
            <div className="mt-auto">
              <Separator className="mb-4" />
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">{track.play_count || 0}</span> прослуховувань
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

