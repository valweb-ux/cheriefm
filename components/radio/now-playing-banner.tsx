"use client"

import { useState, useEffect } from "react"
import { getCurrentTrackInfo } from "@/lib/services/radio-service"
import type { RadioTrackInfo } from "@/types/radio.types"
import { Play, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface NowPlayingBannerProps {
  className?: string
  onPlayClick?: () => void
}

export function NowPlayingBanner({ className, onPlayClick }: NowPlayingBannerProps) {
  const [currentTrack, setCurrentTrack] = useState<RadioTrackInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrackInfo = async () => {
      setLoading(true)
      try {
        const trackInfo = await getCurrentTrackInfo()
        setCurrentTrack(trackInfo)
      } catch (error) {
        console.error("Error fetching current track info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrackInfo()

    // Оновлюємо інформацію кожні 30 секунд
    const interval = setInterval(fetchTrackInfo, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn("bg-gradient-to-r from-primary/20 to-primary/5 p-4 rounded-lg flex items-center gap-4", className)}
    >
      <div className="flex-shrink-0">
        <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={onPlayClick}>
          <Play size={24} />
        </Button>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">ЗАРАЗ В ЕФІРІ</span>
        </div>

        {loading ? (
          <div className="h-6 w-48 bg-muted/50 animate-pulse rounded mt-1"></div>
        ) : currentTrack ? (
          <div className="mt-1">
            <h3 className="font-medium truncate">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        ) : (
          <div className="mt-1 text-muted-foreground">Інформація недоступна</div>
        )}
      </div>

      {currentTrack?.coverUrl && (
        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <Image src={currentTrack.coverUrl || "/placeholder.svg"} alt="Now Playing" fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

