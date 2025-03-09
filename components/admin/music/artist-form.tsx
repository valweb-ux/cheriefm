"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Artist } from "@/types/music.types"
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
import { createArtist, updateArtist, generateArtistSlug } from "@/lib/services/artists-service"
import { ImageUpload } from "@/components/admin/image-upload"

const socialLinkSchema = z.object({
  facebook: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  instagram: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  twitter: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  youtube: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  spotify: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
})

const artistFormSchema = z.object({
  name: z.string().min(2, "Ім'я повинно містити щонайменше 2 символи"),
  slug: z
    .string()
    .min(2, "Slug повинен містити щонайменше 2 символи")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug може містити лише малі літери, цифри та дефіси"),
  bio_uk: z.string().optional().or(z.literal("")),
  bio_fr: z.string().optional().or(z.literal("")),
  bio_en: z.string().optional().or(z.literal("")),
  image_url: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  website: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  social_links: socialLinkSchema,
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
})

type ArtistFormValues = z.infer<typeof artistFormSchema>

export function ArtistForm({ artist }: { artist: Artist | null }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isNewArtist = !artist

  const defaultValues: Partial<ArtistFormValues> = {
    name: artist?.name || "",
    slug: artist?.slug || "",
    bio_uk: artist?.bio_uk || "",
    bio_fr: artist?.bio_fr || "",
    bio_en: artist?.bio_en || "",
    image_url: artist?.image_url || "",
    country: artist?.country || "",
    website: artist?.website || "",
    social_links: {
      facebook: artist?.social_links?.facebook || "",
      instagram: artist?.social_links?.instagram || "",
      twitter: artist?.social_links?.twitter || "",
      youtube: artist?.social_links?.youtube || "",
      spotify: artist?.social_links?.spotify || "",
    },
    is_featured: artist?.is_featured || false,
    is_active: artist?.is_active || true,
    tags: artist?.tags || [],
  }

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: ArtistFormValues) => {
    try {
      setIsLoading(true)

      // Перетворюємо порожні рядки на null
      const formattedData = {
        ...data,
        bio_uk: data.bio_uk || null,
        bio_fr: data.bio_fr || null,
        bio_en: data.bio_en || null,
        image_url: data.image_url || null,
        country: data.country || null,
        website: data.website || null,
        social_links: Object.entries(data.social_links).reduce(
          (acc, [key, value]) => {
            if (value) {
              acc[key] = value
            }
            return acc
          },
          {} as Record<string, string>,
        ),
        tags: data.tags?.length ? data.tags : null,
      }

      if (isNewArtist) {
        await createArtist(formattedData)
        toast({
          title: "Артиста створено",
          description: "Нового артиста успішно додано до бази даних",
        })
      } else {
        await updateArtist(artist.id, formattedData)
        toast({
          title: "Артиста оновлено",
          description: "Інформацію про артиста успішно оновлено",
        })
      }

      router.push("/admin/music/artists")
      router.refresh()
    } catch (error) {
      console.error("Error saving artist:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти інформацію про артиста",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSlug = async () => {
    const name = form.getValues("name")
    if (!name) {
      toast({
        title: "Помилка",
        description: "Спочатку введіть ім'я артиста",
        variant: "destructive",
      })
      return
    }

    try {
      const slug = await generateArtistSlug(name)
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
              <CardDescription>Основні дані про артиста</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ім&apos;я артиста</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть ім'я артиста" {...field} />
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
                        <Input placeholder="artist-slug" {...field} />
                      </FormControl>
                      <FormDescription>Використовується в URL: /artists/artist-slug</FormDescription>
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Країна</FormLabel>
                    <FormControl>
                      <Input placeholder="Україна" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Веб-сайт</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
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
                        <FormDescription>Показувати артиста на сайті</FormDescription>
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
              <CardTitle>Зображення</CardTitle>
              <CardDescription>Завантажте фото артиста</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} bucketName="artists" />
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
            <CardTitle>Біографія</CardTitle>
            <CardDescription>Додайте біографію артиста різними мовами</CardDescription>
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
                  name="bio_uk"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Біографія артиста українською мовою"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="fr">
                <FormField
                  control={form.control}
                  name="bio_fr"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Біографія артиста французькою мовою"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="en">
                <FormField
                  control={form.control}
                  name="bio_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Біографія артиста англійською мовою"
                          className="min-h-[200px]"
                          {...field}
                        />
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
            <CardTitle>Соціальні мережі</CardTitle>
            <CardDescription>Додайте посилання на соціальні мережі артиста</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="social_links.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/artist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_links.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/artist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_links.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/artist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_links.youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/artist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_links.spotify"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify</FormLabel>
                  <FormControl>
                    <Input placeholder="https://open.spotify.com/artist/id" {...field} />
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
              onClick={() => router.push("/admin/music/artists")}
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : isNewArtist ? "Створити артиста" : "Зберегти зміни"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  )
}

