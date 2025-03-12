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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white h-24 shadow-lg">
      <audio ref={audioRef} src={currentStation?.stream_url} preload="auto" onError={() => setIsPlaying(false)} />

      <div className="flex items-center h-full px-6 max-w-7xl mx-auto">
        {/* Left section - Track info */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-20 h-20 mr-6 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            <img src="/placeholder.svg?height=80&width=80" alt="Track artwork" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-gray-400 mb-1">En ce moment sur CHERIE FM</div>
            <div className="font-bold text-lg truncate">{currentTrack.artist}</div>
            <div className="text-sm text-gray-200 truncate">{currentTrack.title}</div>
          </div>
        </div>

        {/* Center section - Play button */}
        <div className="flex-shrink-0 mx-8">
          <button
            onClick={handlePlay}
            className="w-14 h-14 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        </div>

        {/* Right section - Volume and share */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors p-2"
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
                className="w-full accent-pink-600"
                aria-label="Volume"
              />
            </div>
          </div>

          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="Share"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div className="h-full bg-pink-600" style={{ width: "30%" }} />
      </div>
    </div>
  )
}

