"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { createClient } from "@/lib/supabase/client" // Use client version instead

export default function RadioPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [radioInfo, setRadioInfo] = useState<any>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio("https://online.cheriefm.ua/cheriefm")
    setAudioElement(audio)

    // Fetch radio info
    const fetchRadioInfo = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("radio_info").select("*").single()

      if (data) {
        setRadioInfo(data)
      }
    }

    fetchRadioInfo()

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  const togglePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
      } else {
        audioElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="bg-primary/5 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Chérie FM Live</h3>
          {radioInfo && (
            <p className="text-sm text-muted-foreground">Now playing: {radioInfo.current_track || "Unknown"}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <Button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
        </div>
      </div>
    </div>
  )
}

