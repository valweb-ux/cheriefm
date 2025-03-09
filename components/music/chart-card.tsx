import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ChartEntryProps {
  position: number
  previousPosition?: number | null
  track: {
    id: string
    title: string
    cover_url?: string
    artist: {
      id: string
      name: string
      slug?: string
    }
  }
  onPlay?: () => void
}

export function ChartEntry({ position, previousPosition, track, onPlay }: ChartEntryProps) {
  // Визначаємо зміну позиції
  let positionChange: "up" | "down" | "same" | "new" = "same"
  let positionDiff = 0

  if (previousPosition === null) {
    positionChange = "new"
  } else if (previousPosition !== undefined) {
    if (previousPosition < position) {
      positionChange = "down"
      positionDiff = position - previousPosition
    } else if (previousPosition > position) {
      positionChange = "up"
      positionDiff = previousPosition - position
    }
  }

  // Колір та іконка для зміни позиції
  const getPositionIndicator = () => {
    switch (positionChange) {
      case "up":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <ArrowUp size={12} className="mr-1" />
            {positionDiff}
          </Badge>
        )
      case "down":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <ArrowDown size={12} className="mr-1" />
            {positionDiff}
          </Badge>
        )
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            NEW
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            <Minus size={12} />
          </Badge>
        )
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md group">
      {/* Позиція в чарті */}
      <div className="flex flex-col items-center justify-center w-10">
        <span className="text-lg font-bold">{position}</span>
        <div className="mt-1">{getPositionIndicator()}</div>
      </div>

      {/* Обкладинка треку */}
      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
        {track.cover_url ? (
          <Image src={track.cover_url || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-lg font-bold text-muted-foreground">{track.title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Інформація про трек */}
      <div className="flex-grow min-w-0">
        <Link href={`/music/tracks/${track.id}`} className="hover:underline">
          <h3 className="font-medium truncate">{track.title}</h3>
        </Link>

        <Link
          href={track.artist.slug ? `/music/artists/${track.artist.slug}` : `/music/artists/${track.artist.id}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline truncate block"
        >
          {track.artist.name}
        </Link>
      </div>
    </div>
  )
}

interface ChartCardProps {
  id: string
  title: string
  description?: string
  slug?: string
  entries: ChartEntryProps[]
  className?: string
  limit?: number
}

export function ChartCard({ id, title, description, slug, entries, className, limit = 5 }: ChartCardProps) {
  const href = slug ? `/music/charts/${slug}` : `/music/charts/${id}`
  const limitedEntries = entries.slice(0, limit)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {limitedEntries.map((entry) => (
            <ChartEntry
              key={`${entry.position}-${entry.track.id}`}
              position={entry.position}
              previousPosition={entry.previousPosition}
              track={entry.track}
              onPlay={entry.onPlay}
            />
          ))}
        </div>

        {entries.length > limit && (
          <div className="mt-4 text-center">
            <Link href={href} className="text-sm text-primary hover:underline">
              Переглянути повний чарт
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

