"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TrackSelector from "./track-selector"

interface Track {
  id: string
  title: string
  artist: string
}

interface PlaylistFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    tracks: Track[]
  }
  onSubmit: (data: any) => void
}

export default function PlaylistForm({ initialData, onSubmit }: PlaylistFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    tracks: initialData?.tracks || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTracksChange = (tracks: Track[]) => {
    setFormData((prev) => ({ ...prev, tracks }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: initialData?.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Назва плейлиста</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Треки</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackSelector selectedTracks={formData.tracks} onTracksChange={handleTracksChange} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Скасувати
        </Button>
        <Button type="submit">{initialData?.id ? "Оновити плейлист" : "Створити плейлист"}</Button>
      </div>
    </form>
  )
}

