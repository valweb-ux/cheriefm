"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { RadioStation } from "../types"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface RadioPlayerProps {
  stations: RadioStation[]
}

export function RadioPlayer({ stations }: RadioPlayerProps) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const handleStationChange = (station: RadioStation) => {
    setCurrentStation(station)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.play()
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
    <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
      <audio ref={audioRef} src={currentStation?.stream_url} preload="auto" onError={() => setIsPlaying(false)} />

      {currentStation && (
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {currentStation.logo_url ? (
                <img
                  src={currentStation.logo_url || "/placeholder.svg"}
                  alt={currentStation.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl font-bold text-muted-foreground">{currentStation.name.charAt(0)}</div>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{currentStation.name}</h2>
          {currentStation.genre && <p className="text-sm text-muted-foreground mb-2">{currentStation.genre}</p>}
          {currentStation.description && <p className="text-sm text-muted-foreground">{currentStation.description}</p>}
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={handlePlay}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/90 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="w-32">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-primary"
            aria-label="Volume"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm mb-2">Stations</h3>
        <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
          {stations.map((station) => (
            <button
              key={station.id}
              onClick={() => handleStationChange(station)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                currentStation?.id === station.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="font-medium">{station.name}</div>
                  {station.genre && <div className="text-xs text-muted-foreground">{station.genre}</div>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

