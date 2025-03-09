import type { Metadata } from "next"
import { MusicPlayer } from "@/components/music/music-player"
import { TrackCard } from "@/components/music/track-card"
import { ArtistCard } from "@/components/music/artist-card"
import { PlaylistCard } from "@/components/music/playlist-card"
import { ChartCard } from "@/components/music/chart-card"
import {
  getFeaturedArtists,
  getFeaturedTracks,
  getFeaturedPlaylists,
  getActiveCharts,
  getChartEntries,
} from "@/lib/services/music-services"

export const metadata: Metadata = {
  title: "Музика | Chérie FM",
  description: "Слухайте найкращу музику на Chérie FM - популярні треки, плейлисти та чарти",
}

export default async function MusicPage() {
  // Отримуємо дані для відображення на сторінці
  const featuredArtists = await getFeaturedArtists(6)
  const featuredTracks = await getFeaturedTracks(8)
  const featuredPlaylists = await getFeaturedPlaylists(4)
  const charts = await getActiveCharts()

  // Отримуємо дані для першого чарту, якщо він є
  let chartEntries = []
  if (charts.length > 0) {
    chartEntries = await getChartEntries(charts[0].id)
  }

  // Перетворюємо дані чарту у формат, який очікує компонент ChartCard
  const formattedChartEntries = chartEntries.map((entry) => ({
    position: entry.position,
    previousPosition: entry.previous_position,
    track: {
      id: entry.track.id,
      title: entry.track.title,
      cover_url: entry.track.cover_url,
      artist: {
        id: entry.track.artist.id,
        name: entry.track.artist.name,
        slug: entry.track.artist.slug,
      },
    },
  }))

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Музика</h1>

      {/* Музичний плеєр */}
      <div className="mb-10">
        <MusicPlayer
          initialTrack={
            featuredTracks[0]
              ? {
                  id: featuredTracks[0].id,
                  title: featuredTracks[0].title,
                  artist: {
                    name: featuredTracks[0].artists.name,
                  },
                  cover_url: featuredTracks[0].cover_url,
                  audio_url: featuredTracks[0].audio_url,
                  duration: featuredTracks[0].duration,
                }
              : undefined
          }
          playlist={featuredTracks.map((track) => ({
            id: track.id,
            title: track.title,
            artist: {
              name: track.artists.name,
            },
            cover_url: track.cover_url,
            audio_url: track.audio_url,
            duration: track.duration,
          }))}
        />
      </div>

      {/* Популярні треки */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Популярні треки</h2>
        <div className="grid gap-3">
          {featuredTracks.map((track) => (
            <TrackCard
              key={track.id}
              id={track.id}
              title={track.title}
              artist={{
                id: track.artists.id,
                name: track.artists.name,
                slug: track.artists.slug,
              }}
              cover_url={track.cover_url}
              duration={track.duration}
            />
          ))}
        </div>
      </section>

      {/* Популярні артисти */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Популярні артисти</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image_url={artist.image_url}
              slug={artist.slug}
            />
          ))}
        </div>
      </section>

      {/* Плейлисти */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Плейлисти</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              description={playlist.description}
              cover_url={playlist.cover_url}
              trackCount={playlist.tracks?.length || 0}
              slug={playlist.slug}
            />
          ))}
        </div>
      </section>

      {/* Чарти */}
      {charts.length > 0 && formattedChartEntries.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Чарти</h2>
          <ChartCard
            id={charts[0].id}
            title={charts[0].title_uk || charts[0].title}
            description={charts[0].description_uk || charts[0].description}
            slug={charts[0].slug}
            entries={formattedChartEntries}
            limit={10}
          />
        </section>
      )}
    </div>
  )
}

