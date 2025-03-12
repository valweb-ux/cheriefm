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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white h-20">
      <audio ref={audioRef} src={currentStation?.stream_url} preload="auto" onError={() => setIsPlaying(false)} />

      <div className="flex items-center h-full px-4">
        {/* Left section - Track info */}
        <div className="flex items-center flex-1">
          <div className="w-16 h-16 mr-4 bg-gray-800 overflow-hidden">
            <img src="/placeholder.svg" alt="Track artwork" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm text-gray-400">En ce moment sur CHERIE FM</div>
            <div className="font-medium">{currentTrack.artist}</div>
            <div className="text-sm">{currentTrack.title}</div>
          </div>
        </div>

        {/* Center section - Play button */}
        <div className="flex-shrink-0 mx-8">
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Right section - Volume and share */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="w-24">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-white"
              aria-label="Volume"
            />
          </div>

          <button className="text-white hover:text-gray-300 transition-colors" aria-label="Share">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-white"
          style={{ width: "30%" }} // This would be dynamic in a real implementation
        />
      </div>
    </div>
  )
}

