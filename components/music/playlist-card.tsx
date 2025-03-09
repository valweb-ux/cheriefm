"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PlaylistCardProps {
  id: string
  title: string
  description?: string
  cover_url?: string
  trackCount?: number
  slug?: string
  onPlay?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PlaylistCard({
  id,
  title,
  description,
  cover_url,
  trackCount,
  slug,
  onPlay,
  className,
  size = "md",
}: PlaylistCardProps) {
  const href = slug ? `/music/playlists/${slug}` : `/music/playlists/${id}`

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }

  const contentClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  }

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className={cn("p-0", contentClasses[size])}>
        <div className="flex flex-col">
          {/* Обкладинка плейлиста */}
          <div className={cn("relative overflow-hidden rounded-md mb-3", sizeClasses[size])}>
            <Link href={href}>
              {cover_url ? (
                <Image src={cover_url || "/placeholder.svg"} alt={title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">{title.charAt(0)}</span>
                </div>
              )}
            </Link>

            {/* Кнопка відтворення при наведенні */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="default" size="icon" className="h-10 w-10 rounded-full shadow-lg" onClick={onPlay}>
                <Play size={20} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* Інформація про плейлист */}
          <Link href={href} className="hover:underline">
            <h3 className="font-medium text-sm truncate">{title}</h3>
          </Link>

          {description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>}

          {trackCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {trackCount} {trackCount === 1 ? "трек" : trackCount > 1 && trackCount < 5 ? "треки" : "треків"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

