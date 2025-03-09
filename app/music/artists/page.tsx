import type { Metadata } from "next"
import { getArtists } from "@/lib/services/music-services"
import { ArtistCard } from "@/components/music/artist-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Артисти | Chérie FM",
  description: "Перегляньте всіх артистів на Chérie FM",
}

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}) {
  const search = searchParams.search || ""
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 24

  const { data: artists, count } = await getArtists({
    limit,
    offset: (page - 1) * limit,
    search,
    active: true,
    orderBy: "name",
    orderDirection: "asc",
  })

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Артисти</h1>

      {/* Пошук */}
      <div className="mb-8">
        <form className="flex gap-2 max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input name="search" placeholder="Пошук артистів..." className="pl-10" defaultValue={search} />
          </div>
          <Button type="submit">Пошук</Button>
        </form>
      </div>

      {/* Список артистів */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            id={artist.id}
            name={artist.name}
            image_url={artist.image_url}
            slug={artist.slug}
            size="lg"
          />
        ))}
      </div>

      {/* Пагінація */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <a
                key={pageNum}
                href={`/music/artists?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`px-4 py-2 rounded ${
                  pageNum === page ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {pageNum}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

