"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { incrementPlayCount } from "@/lib/services/tracks-service"
import { handleError } from "@/lib/utils/error-handler"

export type Track = {
  id: string
  title: string
  artist: {
    name: string
  }
  cover_url?: string
  audio_url: string
  duration?: number
}

interface MusicPlayerProps {
  className?: string
  initialTrack?: Track | null
  playlist?: Track[]
  onTrackChange?: (track: Track) => void
  autoplay?: boolean
}

export function MusicPlayer({
  className,
  initialTrack = null,
  playlist = [],
  onTrackChange,
  autoplay = false,
}: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(initialTrack)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [playedTracks, setPlayedTracks] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ініціалізація аудіо елемента
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Функція для запису відтворення треку
  const recordPlayCount = useCallback(async (trackId: string) => {
    try {
      await incrementPlayCount(trackId)
    } catch (error) {
      handleError(error, "Помилка при збільшенні лічильника відтворень", false)
    }
  }, [])

  // Оновлення треку при зміні currentTrack
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return

    const handleCanPlay = () => {
      if (autoplay) {
        audioRef.current?.play().catch((e) => {
          handleError(e, "Автоматичне відтворення заблоковано", false)
          setIsPlaying(false)
        })
        setIsPlaying(true)
      }
      setDuration(audioRef.current?.duration || 0)
    }

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleEnded = () => {
      // Додаємо трек до історії прослуханих
      if (currentTrack) {
        setPlayedTracks((prev) => [...prev, currentTrack.id])

        // Збільшуємо лічильник відтворень
        recordPlayCount(currentTrack.id)
      }

      if (isRepeat) {
        audioRef.current!.currentTime = 0
        audioRef.current!.play().catch((e) => handleError(e, "Помилка відтворення", false))
      } else {
        playNextTrack()
      }
    }

    audioRef.current.src = currentTrack.audio_url
    audioRef.current.load()

    audioRef.current.addEventListener("canplay", handleCanPlay)
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplay", handleCanPlay)
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentTrack, autoplay, isRepeat, recordPlayCount])

  // Керування відтворенням
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play().catch((e) => {
        handleError(e, "Помилка відтворення", false)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Керування гучністю
  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat)
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const playNextTrack = useCallback(() => {
    if (!playlist || playlist.length === 0) return

    if (isShuffle) {
      // Виключаємо поточний трек з можливих варіантів
      const availableTracks = playlist.filter(
        (track) => track.id !== currentTrack?.id && !playedTracks.includes(track.id),
      )

      // Якщо всі треки вже були відтворені, скидаємо історію
      if (availableTracks.length === 0) {
        setPlayedTracks([])
        const randomIndex = Math.floor(Math.random() * playlist.length)
        const nextTrack = playlist[randomIndex]
        setCurrentTrack(nextTrack)
        if (onTrackChange) onTrackChange(nextTrack)
        return
      }

      // Вибираємо випадковий трек з доступних
      const randomIndex = Math.floor(Math.random() * availableTracks.length)
      const nextTrack = availableTracks[randomIndex]
      setCurrentTrack(nextTrack)
      if (onTrackChange) onTrackChange(nextTrack)
    } else {
      // Послідовне відтворення
      const currentIndex = currentTrack ? playlist.findIndex((track) => track.id === currentTrack.id) : -1

      const nextIndex = (currentIndex + 1) % playlist.length
      const nextTrack = playlist[nextIndex]
      setCurrentTrack(nextTrack)
      if (onTrackChange) onTrackChange(nextTrack)
    }
  }, [playlist, currentTrack, isShuffle, playedTracks, onTrackChange])

  const playPreviousTrack = useCallback(() => {
    if (!playlist || playlist.length === 0 || !currentTrack) return

    // Якщо пройшло менше 3 секунд, переходимо до попереднього треку
    // інакше перемотуємо поточний трек на початок
    if (currentTime < 3) {
      const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
      const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1
      const prevTrack = playlist[prevIndex]
      setCurrentTrack(prevTrack)
      if (onTrackChange) onTrackChange(prevTrack)
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }, [playlist, currentTrack, currentTime, onTrackChange])

  return (
    <div className={cn("bg-background border rounded-lg p-4 shadow-md", className)}>
      <div className="flex items-center gap-4">
        {/* Обкладинка треку */}
        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
          {currentTrack?.cover_url ? (
            <Image
              src={currentTrack.cover_url || "/placeholder.svg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Volume2 className="text-muted-foreground" size={24} />
            </div>
          )}
        </div>

        {/* Інформація про трек */}
        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-sm truncate">{currentTrack?.title || "Не вибрано"}</h3>
          <p className="text-xs text-muted-foreground truncate">{currentTrack?.artist?.name || ""}</p>

          {/* Прогрес-бар */}
          <div className="mt-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="my-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Контроли відтворення */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn(isShuffle && "text-primary")}>
            <Shuffle size={18} />
          </Button>

          <Button variant="ghost" size="icon" onClick={playPreviousTrack} disabled={!currentTrack}>
            <SkipBack size={18} />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            disabled={!currentTrack}
            className="h-10 w-10 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          <Button variant="ghost" size="icon" onClick={playNextTrack} disabled={!currentTrack || playlist.length <= 1}>
            <SkipForward size={18} />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn(isRepeat && "text-primary")}>
            <Repeat size={18} />
          </Button>
        </div>

        {/* Контроль гучності */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}

