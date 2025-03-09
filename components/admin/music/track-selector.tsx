"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Замінюємо @hello-pangea/dnd на просту реалізацію
interface Track {
  id: string
  title: string
  artist: string
}

interface TrackSelectorProps {
  selectedTracks: Track[]
  onTracksChange: (tracks: Track[]) => void
}

export default function TrackSelector({ selectedTracks, onTracksChange }: TrackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])

  // Імітація пошуку треків
  const handleSearch = () => {
    // В реальному додатку тут був би запит до API
    const mockResults: Track[] = [
      { id: "1", title: "Пісня 1", artist: "Виконавець 1" },
      { id: "2", title: "Пісня 2", artist: "Виконавець 2" },
      { id: "3", title: "Пісня 3", artist: "Виконавець 3" },
    ]

    setSearchResults(
      mockResults.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )
  }

  const addTrack = (track: Track) => {
    if (!selectedTracks.some((t) => t.id === track.id)) {
      onTracksChange([...selectedTracks, track])
    }
  }

  const removeTrack = (trackId: string) => {
    onTracksChange(selectedTracks.filter((track) => track.id !== trackId))
  }

  const moveTrack = (fromIndex: number, toIndex: number) => {
    const newTracks = [...selectedTracks]
    const [movedTrack] = newTracks.splice(fromIndex, 1)
    newTracks.splice(toIndex, 0, movedTrack)
    onTracksChange(newTracks)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Пошук треків..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Пошук</Button>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md p-2">
          <h3 className="font-medium mb-2">Результати пошуку</h3>
          <ul className="space-y-1">
            {searchResults.map((track) => (
              <li key={track.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                <span>
                  {track.title} - {track.artist}
                </span>
                <Button variant="ghost" size="sm" onClick={() => addTrack(track)}>
                  Додати
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border rounded-md p-2">
        <h3 className="font-medium mb-2">Вибрані треки</h3>
        {selectedTracks.length === 0 ? (
          <p className="text-muted-foreground text-sm">Немає вибраних треків</p>
        ) : (
          <ul className="space-y-1">
            {selectedTracks.map((track, index) => (
              <li key={track.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span>
                    {track.title} - {track.artist}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {index > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => moveTrack(index, index - 1)}>
                      ↑
                    </Button>
                  )}
                  {index < selectedTracks.length - 1 && (
                    <Button variant="ghost" size="sm" onClick={() => moveTrack(index, index + 1)}>
                      ↓
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => removeTrack(track.id)}>
                    Видалити
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

