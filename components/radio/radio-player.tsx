"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface RadioPlayerProps {
  streamUrl: string
  title: string
  currentTrack: string
}

export function RadioPlayer({ streamUrl, title, currentTrack }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio(streamUrl)
    audio.volume = volume / 100
    audioRef.current = audio

    // Clean up on unmount
    return () => {
      audio.pause()
      audio.src = ""
      audioRef.current = null
    }
  }, [streamUrl])

  const togglePlay = () => {
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
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack}</p>
        </div>
        <Button onClick={togglePlay} size="lg" className="w-12 h-12 rounded-full">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        <Slider value={[volume]} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
      </div>
    </div>
  )
}

