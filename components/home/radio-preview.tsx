"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

// Змінюємо експорт, щоб він був і default, і named
export function RadioPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [radioInfo, setRadioInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio("https://online.cheriefm.ua/cheriefm")
    audioRef.current = audio

    // Add event listeners
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setError("Не вдалося завантажити аудіо-потік")
    })

    // Fetch radio info
    const fetchRadioInfo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/radio/now-playing")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setRadioInfo(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching radio info:", error)
        setError("Не вдалося отримати інформацію про радіо")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRadioInfo()
    // Set up interval to refresh radio info every 30 seconds
    const interval = setInterval(fetchRadioInfo, 30000)

    return () => {
      audio.pause()
      audio.src = ""
      audioRef.current = null
      clearInterval(interval)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err)
          setError("Не вдалося відтворити аудіо")
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="bg-primary/5 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Chérie FM Live</h3>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Завантаження...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Now playing: {radioInfo?.current_track || "Unknown"}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            disabled={!audioRef.current}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <Button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} disabled={!!error}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Додаємо default export
export default RadioPreview

