import { getLatestTracks, getPopularTracks } from "@/lib/services/tracks-service"
import { getGenres } from "@/lib/services/genres-service"
import { TrackCard } from "@/components/music/track-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata = {
  title: "Музика | Chérie FM",
  description: "Слухайте найкращі треки на Chérie FM",
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Отримуємо параметри з URL
  const search = typeof searchParams.q === "string" ? searchParams.q : ""
  const genre = typeof searchParams.genre === "string" ? searchParams.genre : ""
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "latest"

  // Отримуємо дані
  const genres = await getGenres()
  const latestTracks = await getLatestTracks(20)
  const popularTracks = await getPopularTracks(20)

  // Фільтруємо треки відповідно до параметрів пошуку
  const filterTracks = (tracks: any[]) => {
    return tracks.filter((track) => {
      const matchesSearch = search
        ? track.title.toLowerCase().includes(search.toLowerCase()) ||
          track.artists.name.toLowerCase().includes(search.toLowerCase())
        : true

      const matchesGenre = genre ? track.genre === genre : true

      return matchesSearch && matchesGenre
    })
  }

  const filteredLatest = filterTracks(latestTracks)
  const filteredPopular = filterTracks(popularTracks)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Музика</h1>

      {/* Фільтри та пошук */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Пошук треків та артистів" className="pl-10" defaultValue={search} />
        </div>

        <div className="flex gap-2">
          <Select defaultValue={genre || ""}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Жанр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Усі жанри</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue={sort} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="latest">Нові</TabsTrigger>
          <TabsTrigger value="popular">Популярні</TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          <div className="grid gap-2">
            {filteredLatest.length > 0 ? (
              filteredLatest.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artists}
                  cover_url={track.cover_url}
                  duration={track.duration}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Не знайдено треків, що відповідають вашому запиту</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid gap-2">
            {filteredPopular.length > 0 ? (
              filteredPopular.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artists}
                  cover_url={track.cover_url}
                  duration={track.duration}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Не знайдено треків, що відповідають вашому запиту</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

