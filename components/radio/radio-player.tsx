"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { getRadioAdvertSettings } from "@/lib/services/radio-adverts-service"
import { TargetedAdvertPlayer } from "./targeted-advert-player"
import type { RadioAdvertSettings } from "@/types/radio.types"

interface RadioPlayerProps {
  streamUrl: string
  title: string
  subtitle?: string
  coverImage?: string
  programId?: string
}

export function RadioPlayer({ streamUrl, title, subtitle, coverImage, programId }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [showAdvert, setShowAdvert] = useState(false)
  const [advertSettings, setAdvertSettings] = useState<RadioAdvertSettings | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previousVolumeRef = useRef(volume)

  // Завантаження налаштувань реклами
  useEffect(() => {
    const loadAdvertSettings = async () => {
      try {
        const settings = await getRadioAdvertSettings()
        setAdvertSettings(settings)

        // Показуємо рекламу перед початком стріму, якщо це налаштовано
        if (settings.enabled && settings.playBeforeStream) {
          setShowAdvert(true)
        }
      } catch (error) {
        console.error("Error loading advert settings:", error)
      }
    }

    loadAdvertSettings()
  }, [])

  // Обробка зміни гучності
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    if (!isPlaying && advertSettings?.enabled && advertSettings.playBeforeStream && !showAdvert) {
      // Показуємо рекламу перед відтворенням
      setShowAdvert(true)
      return
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolumeRef.current)
    } else {
      previousVolumeRef.current = volume
      setVolume(0)
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleAdvertComplete = () => {
    setShowAdvert(false)

    // Автоматично починаємо відтворення після реклами
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Error playing stream after advert:", error)
          setIsPlaying(false)
        })
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        {showAdvert ? (
          <TargetedAdvertPlayer
            programId={programId}
            onComplete={handleAdvertComplete}
            canSkip={advertSettings?.skipEnabled}
            skipAfterSeconds={advertSettings?.skipAfterSeconds}
          />
        ) : (
          <>
            <div className="flex items-center gap-4">
              {coverImage && (
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img src={coverImage || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>
            </div>

            <audio ref={audioRef} src={streamUrl} className="hidden" />
          </>
        )}
      </CardContent>
    </Card>
  )
}

