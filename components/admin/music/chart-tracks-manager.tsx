"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Music, Plus, ArrowUp, ArrowDown, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  getChartEntries,
  addTrackToChart,
  updateChartEntry,
  removeTrackFromChart,
  updateChartPositions,
} from "@/lib/services/charts-service"
import { getTracks } from "@/lib/services/tracks-service"
import type { ChartEntry, Track } from "@/types/music.types"

interface ChartTracksManagerProps {
  chartId: string
}

export default function ChartTracksManager({ chartId }: ChartTracksManagerProps) {
  const router = useRouter()
  const [entries, setEntries] = useState<ChartEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingPositions, setIsUpdatingPositions] = useState(false)

  useEffect(() => {
    loadChartEntries()
  }, [chartId])

  const loadChartEntries = async () => {
    try {
      setLoading(true)
      const data = await getChartEntries(chartId)
      setEntries(data)
    } catch (error) {
      console.error("Error loading chart entries:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити треки чарту",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const { data } = await getTracks(1, 10, searchQuery)
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching tracks:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося знайти треки",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddTrack = async (track: Track) => {
    try {
      setIsSaving(true)

      // Знаходимо максимальну позицію
      const maxPosition = entries.length > 0 ? Math.max(...entries.map((entry) => entry.position)) : 0

      const newEntry = await addTrackToChart({
        chart_id: chartId,
        track_id: track.id,
        position: maxPosition + 1,
        previous_position: null,
        weeks_on_chart: 1,
      })

      // Оновлюємо список треків
      await loadChartEntries()

      // Очищаємо пошук
      setSearchQuery("")
      setSearchResults([])

      toast({
        title: "Успішно",
        description: "Трек додано до чарту",
      })
    } catch (error) {
      console.error("Error adding track to chart:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося додати трек до чарту",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleMoveUp = async (entry: ChartEntry) => {
    const currentIndex = entries.findIndex((e) => e.id === entry.id)
    if (currentIndex <= 0) return // Вже на першій позиції

    const newPosition = entry.position - 1
    const prevEntry = entries.find((e) => e.position === newPosition)

    if (!prevEntry) return

    try {
      // Оновлюємо позицію поточного треку
      await updateChartEntry(chartId, entry.track.id, { position: newPosition })

      // Оновлюємо позицію треку, який був вище
      await updateChartEntry(chartId, prevEntry.track.id, { position: entry.position })

      // Оновлюємо список треків
      await loadChartEntries()

      toast({
        title: "Успішно",
        description: "Позицію треку оновлено",
      })
    } catch (error) {
      console.error("Error moving track up:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося змінити позицію треку",
        variant: "destructive",
      })
    }
  }

  const handleMoveDown = async (entry: ChartEntry) => {
    const currentIndex = entries.findIndex((e) => e.id === entry.id)
    if (currentIndex >= entries.length - 1) return // Вже на останній позиції

    const newPosition = entry.position + 1
    const nextEntry = entries.find((e) => e.position === newPosition)

    if (!nextEntry) return

    try {
      // Оновлюємо позицію поточного треку
      await updateChartEntry(chartId, entry.track.id, { position: newPosition })

      // Оновлюємо позицію треку, який був нижче
      await updateChartEntry(chartId, nextEntry.track.id, { position: entry.position })

      // Оновлюємо список треків
      await loadChartEntries()

      toast({
        title: "Успішно",
        description: "Позицію треку оновлено",
      })
    } catch (error) {
      console.error("Error moving track down:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося змінити позицію треку",
        variant: "destructive",
      })
    }
  }

  const handleRemoveTrack = async (entry: ChartEntry) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей трек з чарту?")) return

    try {
      await removeTrackFromChart(chartId, entry.track.id)

      // Оновлюємо список треків
      await loadChartEntries()

      toast({
        title: "Успішно",
        description: "Трек видалено з чарту",
      })
    } catch (error) {
      console.error("Error removing track from chart:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити трек з чарту",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePositions = async () => {
    if (
      !window.confirm("Ви впевнені, що хочете оновити позиції треків? Поточні позиції будуть збережені як попередні.")
    )
      return

    try {
      setIsUpdatingPositions(true)
      await updateChartPositions(chartId)

      // Оновлюємо список треків
      await loadChartEntries()

      toast({
        title: "Успішно",
        description: "Позиції треків оновлено",
      })
    } catch (error) {
      console.error("Error updating chart positions:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося оновити позиції треків",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPositions(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "00:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getPositionChange = (entry: ChartEntry) => {
    if (entry.previous_position === null) return "new"

    const change = entry.previous_position - entry.position
    if (change > 0) return "up"
    if (change < 0) return "down"
    return "same"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Треки в чарті</CardTitle>
          <Button
            variant="outline"
            onClick={handleUpdatePositions}
            disabled={isUpdatingPositions || entries.length === 0}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isUpdatingPositions ? "Оновлення..." : "Оновити позиції"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Треків у чарті немає</h3>
              <p className="text-muted-foreground mt-2">Додайте треки до чарту, використовуючи пошук нижче</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Позиція</TableHead>
                    <TableHead>Трек</TableHead>
                    <TableHead>Виконавець</TableHead>
                    <TableHead>Тривалість</TableHead>
                    <TableHead>Тижнів у чарті</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries
                    .sort((a, b) => a.position - b.position)
                    .map((entry) => {
                      const positionChange = getPositionChange(entry)

                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span className="text-lg font-bold mr-2">{entry.position}</span>
                              {positionChange === "new" && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                >
                                  NEW
                                </Badge>
                              )}
                              {positionChange === "up" && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                >
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                  {Math.abs(entry.previous_position! - entry.position)}
                                </Badge>
                              )}
                              {positionChange === "down" && (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                  {Math.abs(entry.previous_position! - entry.position)}
                                </Badge>
                              )}
                              {positionChange === "same" && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                >
                                  =
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {entry.track.cover_url ? (
                                <Image
                                  src={entry.track.cover_url || "/placeholder.svg"}
                                  alt={entry.track.title}
                                  width={40}
                                  height={40}
                                  className="rounded-md mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3">
                                  <Music className="h-5 w-5" />
                                </div>
                              )}
                              <span>{entry.track.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{entry.track.artist?.name || "Невідомий виконавець"}</TableCell>
                          <TableCell>{formatDuration(entry.track.duration)}</TableCell>
                          <TableCell>{entry.weeks_on_chart}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveUp(entry)}
                                disabled={entry.position === 1}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveDown(entry)}
                                disabled={entry.position === entries.length}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveTrack(entry)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Додати трек до чарту</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Пошук треків..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? "Пошук..." : "Пошук"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Трек</TableHead>
                    <TableHead>Виконавець</TableHead>
                    <TableHead>Тривалість</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {track.cover_url ? (
                            <Image
                              src={track.cover_url || "/placeholder.svg"}
                              alt={track.title}
                              width={40}
                              height={40}
                              className="rounded-md mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mr-3">
                              <Music className="h-5 w-5" />
                            </div>
                          )}
                          <span>{track.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{track.artists?.name || "Невідомий виконавець"}</TableCell>
                      <TableCell>{formatDuration(track.duration)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddTrack(track)}
                          disabled={isSaving || entries.some((e) => e.track.id === track.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {entries.some((e) => e.track.id === track.id) ? "Вже в чарті" : "Додати"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

