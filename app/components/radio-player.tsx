"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { RadioStation } from "../types"
import { Play, Pause, Volume2, VolumeX, Share2 } from "lucide-react"

interface RadioPlayerProps {
  stations: RadioStation[]
}

export function RadioPlayer({ stations }: RadioPlayerProps) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrack, setCurrentTrack] = useState({
    artist: "Jane Fostin",
    title: "LA TAILLE DE TON AMOUR",
  })

  useEffect(() => {
    if (stations.length > 0 && !currentStation) {
      setCurrentStation(stations[0])
    }
  }, [stations, currentStation])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "CHERIE FM",
          text: `Now playing: ${currentTrack.artist} - ${currentTrack.title}`,
          url: window.location.href,
        })
        .catch(console.error)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black h-[72px] flex items-center">
      <audio ref={audioRef} src={currentStation?.stream_url} preload="auto" onError={() => setIsPlaying(false)} />

      {/* Album art */}
      <div className="h-full aspect-square bg-gray-800 mr-4">
        <img src="/placeholder.svg?height=72&width=72" alt="Track artwork" className="w-full h-full object-cover" />
      </div>

      {/* Track info */}
      <div className="flex-1">
        <div className="text-xs text-gray-400">En ce moment sur CHERIE FM</div>
        <div className="text-white font-medium">{currentTrack.artist}</div>
        <div className="text-white text-sm">{currentTrack.title}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 px-6">
        {/* Play button */}
        <button
          onClick={handlePlay}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-white"
            aria-label="Volume"
          />
        </div>

        {/* Share button */}
        <button onClick={handleShare} className="text-white hover:text-gray-300 transition-colors" aria-label="Share">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  )
}

