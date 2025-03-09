"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Genre } from "@/types/music.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createGenre, updateGenre } from "@/lib/services/genres-service"
import { slugify } from "@/lib/utils"

const genreFormSchema = z.object({
  name: z.string().min(2, "Назва повинна містити щонайменше 2 символи"),
  slug: z
    .string()
    .min(2, "Slug повинен містити щонайменше 2 символи")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug може містити лише малі літери, цифри та дефіси"),
  description: z.string().optional().nullable(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Введіть коректний HEX-код кольору")
    .optional()
    .nullable(),
  icon: z.string().optional().nullable(),
  parent_id: z.string().optional().nullable(),
})

type GenreFormValues = z.infer<typeof genreFormSchema>

export function GenreForm({
  genre,
  genres,
}: {
  genre: Genre | null
  genres: Genre[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isNewGenre = !genre

  const defaultValues: Partial<GenreFormValues> = {
    name: genre?.name || "",
    slug: genre?.slug || "",
    description: genre?.description || "",
    color: genre?.color || "#6366f1",
    icon: genre?.icon || "",
    parent_id: genre?.parent_id || null,
  }

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: GenreFormValues) => {
    try {
      setIsLoading(true)

      // Перетворюємо порожні рядки на null
      const formattedData = {
        ...data,
        description: data.description || null,
        color: data.color || null,
        icon: data.icon || null,
        parent_id: data.parent_id || null,
      }

      if (isNewGenre) {
        await createGenre(formattedData)
        toast({
          title: "Жанр створено",
          description: "Новий жанр успішно додано до бази даних",
        })
      } else {
        await updateGenre(genre.id, formattedData)
        toast({
          title: "Жанр оновлено",
          description: "Інформацію про жанр успішно оновлено",
        })
      }

      router.push("/admin/music/genres")
      router.refresh()
    } catch (error) {
      console.error("Error saving genre:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти інформацію про жанр",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSlug = () => {
    const name = form.getValues("name")
    if (!name) {
      toast({
        title: "Помилка",
        description: "Спочатку введіть назву жанру",
        variant: "destructive",
      })
      return
    }

    const slug = slugify(name)
    form.setValue("slug", slug)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Інформація про жанр</CardTitle>
            <CardDescription>Основні дані про музичний жанр</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва жанру</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть назву жанру" {...field} />
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
                      <Input placeholder="genre-slug" {...field} />
                    </FormControl>
                    <FormDescription>Використовується в URL: /genres/genre-slug</FormDescription>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Опис жанру" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Колір</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <Input value={field.value || ""} onChange={field.onChange} placeholder="#000000" />
                    </div>
                    <FormDescription>Виберіть колір для жанру</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Іконка</FormLabel>
                    <FormControl>
                      <Input placeholder="Emoji або Unicode символ" {...field} />
                    </FormControl>
                    <FormDescription>Введіть emoji або Unicode символ для іконки</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Батьківський жанр</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Виберіть батьківський жанр (опціонально)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Без батьківського жанру</SelectItem>
                      {genres
                        .filter((g) => g.id !== genre?.id) // Виключаємо поточний жанр зі списку
                        .map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Виберіть батьківський жанр, якщо цей жанр є піджанром</FormDescription>
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
              onClick={() => router.push("/admin/music/genres")}
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : isNewGenre ? "Створити жанр" : "Зберегти зміни"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  )
}

