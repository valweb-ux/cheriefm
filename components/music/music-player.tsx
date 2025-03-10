"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { formatTime } from "@/lib/utils"

interface Track {
  id: string
  title: string
  artist_name: string
  album?: string
  duration: number
  image_url: string
  audio_url: string
}

interface MusicPlayerProps {
  tracks: Track[]
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)

  const currentTrack =
    tracks && tracks.length > 0
      ? tracks[currentTrackIndex]
      : {
          id: "0",
          title: "Немає треків",
          artist_name: "Невідомий",
          duration: 0,
          image_url: "/placeholder.svg?height=300&width=300",
          audio_url: "",
        }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const playPrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
  }

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.image_url || "/placeholder.svg"}
          alt={currentTrack.title}
          className="w-16 h-16 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{currentTrack.artist_name}</p>
          {currentTrack.album && <p className="text-xs text-muted-foreground truncate">{currentTrack.album}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
        <Slider value={[currentTime]} max={currentTrack.duration} step={1} onValueChange={handleTimeChange} />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={playPrevious}>
          <SkipBack size={20} />
        </Button>
        <Button onClick={togglePlay} size="lg" className="w-12 h-12 rounded-full">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNext}>
          <SkipForward size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        <Slider value={[volume]} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Наступні треки</h4>
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <li
              key={track.id}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted ${
                index === currentTrackIndex ? "bg-muted" : ""
              }`}
              onClick={() => setCurrentTrackIndex(index)}
            >
              <img
                src={track.image_url || "/placeholder.svg"}
                alt={track.title}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist_name}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

