"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Playlist, Track } from "@/types/music.types"
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
import { toast } from "@/hooks/use-toast"
import { createPlaylist, updatePlaylist, generatePlaylistSlug } from "@/lib/services/playlists-service"
import { ImageUpload } from "@/components/admin/image-upload"
import { TrackSelector } from "@/components/admin/music/track-selector"

const playlistFormSchema = z.object({
  title: z.string().min(2, "Назва повинна містити щонайменше 2 символи"),
  slug: z
    .string()
    .min(2, "Slug повинен містити щонайменше 2 символи")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug може містити лише малі літери, цифри та дефіси"),
  description_uk: z.string().optional().nullable(),
  description_fr: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  cover_url: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tracks: z.array(z.string()).optional().nullable(),
  created_by: z.string(),
})

type PlaylistFormValues = z.infer<typeof playlistFormSchema>

export function PlaylistForm({
  playlist,
  tracks,
  userId,
}: {
  playlist: Playlist | null
  tracks: Track[]
  userId: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isNewPlaylist = !playlist

  const defaultValues: Partial<PlaylistFormValues> = {
    title: playlist?.title || "",
    slug: playlist?.slug || "",
    description_uk: playlist?.description_uk || "",
    description_fr: playlist?.description_fr || "",
    description_en: playlist?.description_en || "",
    cover_url: playlist?.cover_url || "",
    is_featured: playlist?.is_featured || false,
    is_active: playlist?.is_active || true,
    tracks: playlist?.tracks || [],
    created_by: playlist?.created_by || userId,
  }

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: PlaylistFormValues) => {
    try {
      setIsLoading(true)

      // Перетворюємо порожні рядки на null
      const formattedData = {
        ...data,
        description_uk: data.description_uk || null,
        description_fr: data.description_fr || null,
        description_en: data.description_en || null,
        cover_url: data.cover_url || null,
        tracks: data.tracks?.length ? data.tracks : null,
      }

      if (isNewPlaylist) {
        await createPlaylist(formattedData)
        toast({
          title: "Плейлист створено",
          description: "Новий плейлист успішно додано до бази даних",
        })
      } else {
        await updatePlaylist(playlist.id, formattedData)
        toast({
          title: "Плейлист оновлено",
          description: "Інформацію про плейлист успішно оновлено",
        })
      }

      router.push("/admin/music/playlists")
      router.refresh()
    } catch (error) {
      console.error("Error saving playlist:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти інформацію про плейлист",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSlug = async () => {
    const title = form.getValues("title")
    if (!title) {
      toast({
        title: "Помилка",
        description: "Спочатку введіть назву плейлиста",
        variant: "destructive",
      })
      return
    }

    try {
      const slug = await generatePlaylistSlug(title)
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
              <CardDescription>Основні дані про плейлист</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Назва плейлиста</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть назву плейлиста" {...field} />
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
                        <Input placeholder="playlist-slug" {...field} />
                      </FormControl>
                      <FormDescription>Використовується в URL: /playlists/playlist-slug</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" onClick={handleGenerateSlug} className="mb-6">
                  Згенерувати
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Активний</FormLabel>
                        <FormDescription>Показувати плейлист на сайті</FormDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Обкладинка</CardTitle>
              <CardDescription>Завантажте обкладинку плейлиста</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="cover_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload value={field.value || ""} onChange={field.onChange} bucketName="playlists" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Опис плейлиста</CardTitle>
            <CardDescription>Додайте опис плейлиста різними мовами</CardDescription>
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
                  name="description_uk"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Опис плейлиста українською мовою" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr">
                <FormField
                  control={form.control}
                  name="description_fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Опис плейлиста французькою мовою" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en">
                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Опис плейлиста англійською мовою" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Треки</CardTitle>
            <CardDescription>Виберіть треки для плейлиста</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="tracks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TrackSelector tracks={tracks} selectedTrackIds={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end border rounded-lg p-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/music/playlists")}
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : isNewPlaylist ? "Створити плейлист" : "Зберегти зміни"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  )
}

