import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Artist {
  id: string
  name: string
  image_url: string
  genre?: string
}

interface FeaturedArtistsProps {
  artists: Artist[]
}

export function FeaturedArtists({ artists }: FeaturedArtistsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => (
        <Link href={`/music/artists/${artist.id}`} key={artist.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <div className="aspect-square relative">
              <img
                src={artist.image_url || "/placeholder.svg"}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{artist.name}</h3>
              {artist.genre && <p className="text-sm text-muted-foreground mt-1">{artist.genre}</p>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

