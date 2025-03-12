"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { RadioStation } from "../types"
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, Radio } from "lucide-react"

interface RadioPlayerProps {
  stations: RadioStation[]
}

export function RadioPlayer({ stations }: RadioPlayerProps) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Кнопка розгортання/згортання */}
      <div className="flex justify-center">
        <button
          onClick={toggleExpanded}
          className="bg-primary text-primary-foreground rounded-t-md px-4 py-1 -mt-6 shadow-lg"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Основний блок плеєра */}
      <div className="bg-card border-t border-gray-200 shadow-lg">
        <audio ref={audioRef} src={currentStation?.stream_url} preload="auto" onError={() => setIsPlaying(false)} />

        <div className="container mx-auto">
          {currentStation && (
            <div className="p-4">
              {/* Компактний вигляд плеєра */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 mr-4">
                  {currentStation.logo_url ? (
                    <img
                      src={currentStation.logo_url || "/placeholder.svg"}
                      alt={currentStation.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-muted-foreground w-full h-full flex items-center justify-center">
                      {currentStation.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 mr-4">
                  <h2 className="text-lg font-bold truncate">{currentStation.name}</h2>
                  {currentStation.genre && (
                    <p className="text-sm text-muted-foreground truncate">{currentStation.genre}</p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/90 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <div className="w-24 hidden sm:block">
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
              </div>

              {/* Розгорнутий вигляд з вибором станцій */}
              {isExpanded && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {stations.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => handleStationChange(station)}
                      className={`text-left px-3 py-2 rounded-md transition-colors ${
                        currentStation?.id === station.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 mr-2">
                          {station.logo_url ? (
                            <img
                              src={station.logo_url || "/placeholder.svg"}
                              alt={station.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-sm font-bold text-muted-foreground w-full h-full flex items-center justify-center">
                              {station.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{station.name}</div>
                          {station.genre && (
                            <div className="text-xs text-muted-foreground truncate">{station.genre}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Якщо немає станцій */}
          {!currentStation && (
            <div className="p-4 flex items-center justify-center">
              <Radio className="text-muted-foreground mr-2" size={20} />
              <p className="text-muted-foreground">Немає доступних радіостанцій</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

