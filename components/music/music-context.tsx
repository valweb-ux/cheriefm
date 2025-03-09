"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Track } from "@/components/music/music-player"

interface MusicContextType {
  currentTrack: Track | null
  playlist: Track[]
  isPlaying: boolean
  playTrack: (track: Track, newPlaylist?: Track[]) => void
  pauseTrack: () => void
  resumeTrack: () => void
  addToPlaylist: (track: Track) => void
  clearPlaylist: () => void
  nextTrack: () => void
  previousTrack: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  // Зберігаємо стан в localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("music-player-state")
    if (savedState) {
      try {
        const { currentTrack, playlist } = JSON.parse(savedState)
        if (currentTrack) setCurrentTrack(currentTrack)
        if (playlist) setPlaylist(playlist)
      } catch (error) {
        console.error("Error parsing saved music state:", error)
      }
    }
  }, [])

  // Оновлюємо localStorage при зміні стану
  useEffect(() => {
    if (currentTrack || playlist.length > 0) {
      localStorage.setItem("music-player-state", JSON.stringify({ currentTrack, playlist }))
    }
  }, [currentTrack, playlist])

  const playTrack = (track: Track, newPlaylist?: Track[]) => {
    setCurrentTrack(track)
    setIsPlaying(true)

    if (newPlaylist) {
      setPlaylist(newPlaylist)
    } else if (!playlist.some((t) => t.id === track.id)) {
      // Додаємо трек до плейлиста, якщо його там ще немає
      setPlaylist((prev) => [...prev, track])
    }
  }

  const pauseTrack = () => {
    setIsPlaying(false)
  }

  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true)
    }
  }

  const addToPlaylist = (track: Track) => {
    if (!playlist.some((t) => t.id === track.id)) {
      setPlaylist((prev) => [...prev, track])
    }
  }

  const clearPlaylist = () => {
    setPlaylist([])
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  const nextTrack = () => {
    if (!currentTrack || playlist.length <= 1) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentTrack(playlist[nextIndex])
  }

  const previousTrack = () => {
    if (!currentTrack || playlist.length <= 1) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentTrack(playlist[prevIndex])
  }

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        playTrack,
        pauseTrack,
        resumeTrack,
        addToPlaylist,
        clearPlaylist,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}

