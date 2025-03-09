"use client"

import { Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TrackCardProps {
  id: string
  title: string
  artist: {
    id: string
    name: string
    slug?: string
  }
  cover_url?: string
  duration?: number
  onPlay?: () => void
  className?: string
  showArtist?: boolean
  isActive?: boolean
}

export function TrackCard({
  id,
  title,
  artist,
  cover_url,
  duration,
  onPlay,
  className,
  showArtist = true,
  isActive = false,
}: TrackCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:bg-accent/50",
        isActive && "bg-accent/80 border-primary",
        className,
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Обкладинка треку */}
          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
            {cover_url ? (
              <Image src={cover_url || "/placeholder.svg"} alt={title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Play className="text-muted-foreground" size={20} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button variant="ghost" size="icon" className="text-white h-8 w-8" onClick={onPlay}>
                <Play size={18} />
              </Button>
            </div>
          </div>

          {/* Інформація про трек */}
          <div className="flex-grow min-w-0">
            <Link href={`/music/tracks/${id}`} className="hover:underline">
              <h3 className="font-medium text-sm truncate">{title}</h3>
            </Link>

            {showArtist && (
              <Link
                href={artist.slug ? `/music/artists/${artist.slug}` : `/music/artists/${artist.id}`}
                className="text-xs text-muted-foreground hover:text-primary hover:underline truncate block"
              >
                {artist.name}
              </Link>
            )}
          </div>

          {/* Тривалість та кнопки дій */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart size={16} className="text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

