"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Pause, SkipForward } from "lucide-react"
import { incrementAdvertPlayCount } from "@/lib/services/radio-adverts-service"
import { Progress } from "@/components/ui/progress"
import { handleError } from "@/lib/utils/error-handler"
import { useAsync } from "@/hooks/use-async"

interface TargetedAdvertPlayerProps {
  programId?: string
  onComplete: () => void
  onSkip?: () => void
  canSkip?: boolean
  skipAfterSeconds?: number
}

interface AdvertData {
  id: string
  title: string
  audioUrl: string
  duration: number
}

export function TargetedAdvertPlayer({
  programId,
  onComplete,
  onSkip,
  canSkip = true,
  skipAfterSeconds = 5,
}: TargetedAdvertPlayerProps) {
  const [advert, setAdvert] = useState<AdvertData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [canSkipNow, setCanSkipNow] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Використовуємо хук useAsync для завантаження реклами
  const {
    loading,
    error,
    execute: fetchAdvert,
  } = useAsync<AdvertData | null, []>(async () => {
    try {
      const url = new URL("/api/radio/adverts", window.location.origin)
      if (programId) {
        url.searchParams.append("programId", programId)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error("Не вдалося завантажити рекламу")
      }

      const data = await response.json()

      if (!data.success || !data.advert) {
        throw new Error(data.message || "Реклама не знайдена")
      }

      return data.advert as AdvertData
    } catch (err) {
      handleError(err, "Помилка завантаження реклами", false)
      onComplete() // Пропускаємо рекламу у випадку помилки
      return null
    }
  })

  // Завантаження реклами
  useEffect(() => {
    const loadAdvert = async () => {
      const result = await fetchAdvert()
      if (result) {
        setAdvert(result)
      }
    }

    loadAdvert()

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [programId, fetchAdvert])

  // Автоматичне відтворення реклами після завантаження
  useEffect(() => {
    if (advert && audioRef.current) {
      audioRef.current.src = advert.audioUrl
      audioRef.current.load()

      // Автоматичне відтворення
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)

            // Запускаємо таймер для оновлення прогресу
            progressIntervalRef.current = setInterval(() => {
              if (audioRef.current) {
                const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
                setProgress(currentProgress)

                // Перевіряємо, чи можна пропустити рекламу
                if (!canSkipNow && audioRef.current.currentTime >= skipAfterSeconds) {
                  setCanSkipNow(true)
                }
              }
            }, 100)

            // Записуємо відтворення
            incrementAdvertPlayCount(advert.id).catch((err) =>
              handleError(err, "Помилка при збільшенні лічильника відтворень", false),
            )
          })
          .catch((error) => {
            handleError(error, "Помилка відтворення реклами", false)
            setIsPlaying(false)
          })
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [advert, skipAfterSeconds, canSkipNow])

  // Обробка завершення відтворення
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false)
      onComplete()
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [onComplete])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => handleError(err, "Помилка відтворення реклами", true))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSkip = () => {
    if (canSkip && canSkipNow && onSkip) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      onSkip()
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Завантаження реклами...</p>
      </div>
    )
  }

  if (error || !advert) {
    return null // Приховуємо компонент у випадку помилки
  }

  return (
    <div className="p-4 bg-muted rounded-md">
      <audio ref={audioRef} className="hidden" />

      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">Реклама</h3>
          {advert && <p className="text-sm text-muted-foreground">{advert.title}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {canSkip && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              disabled={!canSkipNow}
              className="flex items-center gap-1"
            >
              <SkipForward className="h-4 w-4" />
              {!canSkipNow && `${skipAfterSeconds}с`}
              {canSkipNow && "Пропустити"}
            </Button>
          )}
        </div>
      </div>

      <Progress value={progress} className="h-2" />
    </div>
  )
}

