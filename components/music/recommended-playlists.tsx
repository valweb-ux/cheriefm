import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Playlist {
  id: string
  title: string
  description?: string
  image_url: string
  tracks_count?: number
}

interface RecommendedPlaylistsProps {
  playlists: Playlist[]
}

export function RecommendedPlaylists({ playlists }: RecommendedPlaylistsProps) {
  return (
    <div className="space-y-4">
      {playlists.map((playlist) => (
        <Link href={`/music/playlists/${playlist.id}`} key={playlist.id}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={playlist.image_url || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-bold">{playlist.title}</h3>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                  )}
                  {playlist.tracks_count && (
                    <p className="text-xs text-muted-foreground mt-1">{playlist.tracks_count} треків</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      <div className="text-center mt-4">
        <Link href="/music/playlists" className="text-primary hover:underline">
          Переглянути всі плейлисти
        </Link>
      </div>
    </div>
  )
}

