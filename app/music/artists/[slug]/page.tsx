import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getArtistBySlug, getTracks } from "@/lib/services/music-services"
import { TrackCard } from "@/components/music/track-card"

interface ArtistPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  try {
    const artist = await getArtistBySlug(params.slug)

    return {
      title: `${artist.name} | Chérie FM`,
      description: artist.bio || `Слухайте треки від ${artist.name} на Chérie FM`,
    }
  } catch (error) {
    return {
      title: "Артист | Chérie FM",
      description: "Інформація про артиста на Chérie FM",
    }
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  try {
    const artist = await getArtistBySlug(params.slug)

    // Отримуємо треки артиста
    const { data: tracks } = await getTracks({
      artistId: artist.id,
      active: true,
      limit: 50,
      orderBy: "title",
      orderDirection: "asc",
    })

    return (
      <div className="container py-8">
        {/* Інформація про артиста */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
            {artist.image_url ? (
              <Image src={artist.image_url || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">{artist.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-4 text-center md:text-left">{artist.name}</h1>

            {artist.bio && (
              <div className="prose max-w-none mb-6">
                <p>{artist.bio}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Офіційний сайт
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Треки артиста */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Треки</h2>

          {tracks.length > 0 ? (
            <div className="grid gap-3">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={{
                    id: artist.id,
                    name: artist.name,
                    slug: artist.slug,
                  }}
                  cover_url={track.cover_url}
                  duration={track.duration}
                  showArtist={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Немає доступних треків</p>
          )}
        </section>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

