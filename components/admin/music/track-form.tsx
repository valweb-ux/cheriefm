"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Artist, Genre, Track } from "@/types/music.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createTrack, updateTrack, generateTrackSlug } from "@/lib/services/tracks-service"
import { ImageUpload } from "@/components/admin/image-upload"
import { AudioUpload } from "@/components/admin/audio-upload"

const trackFormSchema = z.object({
  title: z.string().min(2, "Назва повинна містити щонайменше 2 символи"),
  slug: z
    .string()
    .min(2, "Slug повинен містити щонайменше 2 символи")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug може містити лише малі літери, цифри та дефіси"),
  artist_id: z.string().optional().nullable(),
  featuring_artists: z.array(z.string()).optional().nullable(),
  album: z.string().optional().nullable(),
  release_date: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  audio_url: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
  lyrics_uk: z.string().optional().nullable(),
  lyrics_fr: z.string().optional().nullable(),
  lyrics_en: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tags: z.array(z.string()).optional().nullable(),
})

type TrackFormValues = z.infer<typeof trackFormSchema>

export function TrackForm({
  track,
  artists,
  genres,
}: {
  track: Track | null
  artists: Artist[]
  genres: Genre[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isNewTrack = !track

  const defaultValues: Partial<TrackFormValues> = {
    title: track?.title || "",
    slug: track?.slug || "",
    artist_id: track?.artist_id || null,
    featuring_artists: track?.featuring_artists || [],
    album: track?.album || "",
    release_date: track?.release_date || "",
    duration: track?.duration || null,
    audio_url: track?.audio_url || "",
    cover_url: track?.cover_url || "",
    lyrics_uk: track?.lyrics_uk || "",
    lyrics_fr: track?.lyrics_fr || "",
    lyrics_en: track?.lyrics_en || "",
    genre: track?.genre || null,
    is_featured: track?.is_featured || false,
    is_active: track?.is_active || true,
    tags: track?.tags || [],
  }

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: TrackFormValues) => {
    try {
      setIsLoading(true)

      // Перетворюємо порожні рядки на null
      const formattedData = {
        ...data,
        artist_id: data.artist_id || null,
        featuring_artists: data.featuring_artists?.length ? data.featuring_artists : null,
        album: data.album || null,
        release_date: data.release_date || null,
        audio_url: data.audio_url || null,
        cover_url: data.cover_url || null,
        lyrics_uk: data.lyrics_uk || null,
        lyrics_fr: data.lyrics_fr || null,
        lyrics_en: data.lyrics_en || null,
        genre: data.genre || null,
        tags: data.tags?.length ? data.tags : null,
      }

      if (isNewTrack) {
        await createTrack(formattedData)
        toast({
          title: "Трек створено",
          description: "Новий трек успішно додано до бази даних",
        })
      } else {
        await updateTrack(track.id, formattedData)
        toast({
          title: "Трек оновлено",
          description: "Інформацію про трек успішно оновлено",
        })
      }

      router.push("/admin/music/tracks")
      router.refresh()
    } catch (error) {
      console.error("Error saving track:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти інформацію про трек",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSlug = async () => {
    const title = form.getValues("title")
    const artistId = form.getValues("artist_id")

    if (!title) {
      toast({
        title: "Помилка",
        description: "Спочатку введіть назву треку",
        variant: "destructive",
      })
      return
    }

    try {
      // Якщо вибрано артиста, використовуємо його ім'я для генерації slug
      let artistName = ""
      if (artistId) {
        const artist = artists.find((a) => a.id === artistId)
        if (artist) {
          artistName = artist.name
        }
      }

      const slug = await generateTrackSlug(title, artistName)
      form.setValue("slug", slug)
    } catch (error) {
      console.error("Error generating slug:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося згенерувати slug",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
              <CardDescription>Основні дані про музичний трек</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Назва треку</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть назву треку" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="track-slug" {...field} />
                      </FormControl>
                      <FormDescription>Використовується в URL: /tracks/track-slug</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" onClick={handleGenerateSlug} className="mb-6">
                  Згенерувати
                </Button>
              </div>

              <FormField
                control={form.control}
                name="artist_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Артист</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть артиста" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Без артиста</SelectItem>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="album"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Альбом</FormLabel>
                    <FormControl>
                      <Input placeholder="Назва альбому" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="release_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата випуску</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Жанр</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть жанр" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Без жанру</SelectItem>
                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Активний</FormLabel>
                        <FormDescription>Показувати трек на сайті</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Рекомендований</FormLabel>
                        <FormDescription>Показувати в рекомендованих</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Обкладинка</CardTitle>
                <CardDescription>Завантажте обкладинку треку</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="cover_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload value={field.value || ""} onChange={field.onChange} bucketName="tracks" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Аудіо файл</CardTitle>
                <CardDescription>Завантажте аудіо файл треку</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="audio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AudioUpload
                          value={field.value || ""}
                          onChange={(url, duration) => {
                            field.onChange(url)
                            if (duration) {
                              form.setValue("duration", duration)
                            }
                          }}
                          bucketName="tracks"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Текст пісні</CardTitle>
            <CardDescription>Додайте текст пісні різними мовами</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="uk">
              <TabsList className="mb-4">
                <TabsTrigger value="uk">Українська</TabsTrigger>
                <TabsTrigger value="fr">Французька</TabsTrigger>
                <TabsTrigger value="en">Англійська</TabsTrigger>
              </TabsList>

              <TabsContent value="uk">
                <FormField
                  control={form.control}
                  name="lyrics_uk"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Текст пісні українською мовою" className="min-h-[300px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr">
                <FormField
                  control={form.control}
                  name="lyrics_fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Текст пісні французькою мовою" className="min-h-[300px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en">
                <FormField
                  control={form.control}
                  name="lyrics_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Текст пісні англійською мовою" className="min-h-[300px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end border rounded-lg p-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/music/tracks")}
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : isNewTrack ? "Створити трек" : "Зберегти зміни"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  )
}

