"use client"

import { useState } from "react"
import type { Track } from "@/types/music.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Search, Music, Plus, X, GripVertical, Clock, User } from "lucide-react"
import { formatDuration } from "@/lib/utils"

export function TrackSelector({
  tracks,
  selectedTrackIds,
  onChange,
}: {
  tracks: Track[]
  selectedTrackIds: string[]
  onChange: (trackIds: string[]) => void
}) {
  const [search, setSearch] = useState("")
  const [showSelected, setShowSelected] = useState(false)

  // Отримуємо повні об'єкти треків для вибраних ID
  const selectedTracks = selectedTrackIds
    .map((id) => tracks.find((track) => track.id === id))
    .filter(Boolean) as Track[]

  // Фільтруємо треки за пошуком
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      (track.artists?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (track.album || "").toLowerCase().includes(search.toLowerCase())

    // Якщо показуємо тільки вибрані, фільтруємо за вибраними ID
    if (showSelected) {
      return matchesSearch && selectedTrackIds.includes(track.id)
    }

    return matchesSearch
  })

  const handleAddTrack = (trackId: string) => {
    if (!selectedTrackIds.includes(trackId)) {
      onChange([...selectedTrackIds, trackId])
    }
  }

  const handleRemoveTrack = (trackId: string) => {
    onChange(selectedTrackIds.filter((id) => id !== trackId))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(selectedTrackIds)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onChange(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Пошук треків..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => setShowSelected(!showSelected)}>
          {showSelected ? "Показати всі треки" : "Показати вибрані треки"}
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Трек</TableHead>
              <TableHead>Артист</TableHead>
              <TableHead>Альбом</TableHead>
              <TableHead className="w-[80px]">Тривалість</TableHead>
              <TableHead className="w-[80px]">Дія</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {search ? "Треків не знайдено" : "Немає доступних треків"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-secondary">
                        {track.cover_url ? (
                          <img
                            src={track.cover_url || "/placeholder.svg"}
                            alt={track.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Music className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{track.title}</div>
                        {selectedTrackIds.includes(track.id) && (
                          <Badge variant="outline" className="mt-1">
                            Вибрано
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{track.artists?.name || "-"}</TableCell>
                  <TableCell>{track.album || "-"}</TableCell>
                  <TableCell>{track.duration ? formatDuration(track.duration) : "-"}</TableCell>
                  <TableCell>
                    {selectedTrackIds.includes(track.id) ? (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTrack(track.id)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Видалити</span>
                      </Button>
                    ) : (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleAddTrack(track.id)}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Додати</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Вибрані треки ({selectedTracks.length})</h3>
        <div className="border rounded-md">
          {selectedTracks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Треки не вибрано</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selected-tracks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]"></TableHead>
                          <TableHead>Трек</TableHead>
                          <TableHead>Артист</TableHead>
                          <TableHead className="w-[80px]">Тривалість</TableHead>
                          <TableHead className="w-[80px]">Дія</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTracks.map((track, index) => (
                          <Draggable key={track.id} draggableId={track.id} index={index}>
                            {(provided) => (
                              <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                <TableCell>
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab flex items-center justify-center"
                                  >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-secondary">
                                      {track.cover_url ? (
                                        <img
                                          src={track.cover_url || "/placeholder.svg"}
                                          alt={track.title}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                          <Music className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="font-medium">{track.title}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{track.artists?.name || "-"}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{track.duration ? formatDuration(track.duration) : "-"}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveTrack(track.id)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Видалити</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  )
}

