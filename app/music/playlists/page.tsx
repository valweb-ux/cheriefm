import { getFeaturedPlaylists } from "@/lib/services/playlists-service"
import { PlaylistCard } from "@/components/music/playlist-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Плейлисти | Chérie FM",
  description: "Слухайте найкращі плейлисти на Chérie FM",
}

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Отримуємо параметри з URL
  const search = typeof searchParams.q === "string" ? searchParams.q : ""

  // Отримуємо дані
  const playlists = await getFeaturedPlaylists(20)

  // Фільтруємо плейлисти відповідно до параметрів пошуку
  const filteredPlaylists = search
    ? playlists.filter(
        (playlist) =>
          playlist.title.toLowerCase().includes(search.toLowerCase()) ||
          (playlist.description && playlist.description.toLowerCase().includes(search.toLowerCase())),
      )
    : playlists

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Плейлисти</h1>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Пошук плейлистів" className="pl-10" defaultValue={search} />
          </div>

          <Button asChild>
            <Link href="/music/playlists/create">
              <Plus size={18} className="mr-2" />
              Створити
            </Link>
          </Button>
        </div>
      </div>

      {filteredPlaylists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              description={playlist.description}
              cover_url={playlist.cover_url}
              slug={playlist.slug}
              trackCount={playlist.track_count}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Не знайдено плейлистів, що відповідають вашому запиту</p>
          <Button asChild>
            <Link href="/music/playlists/create">
              <Plus size={18} className="mr-2" />
              Створити новий плейлист
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

