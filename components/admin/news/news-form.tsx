"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createNews, updateNews } from "@/lib/actions/news"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { Editor } from "@/components/admin/editor"

const newsSchema = z.object({
  title: z.string().min(2, { message: "Заголовок має містити щонайменше 2 символи." }),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  published_at: z.date().optional(),
  published: z.boolean().default(false),
})

type NewsFormValues = z.infer<typeof newsSchema>

interface NewsFormProps {
  news?: any
}

export function NewsForm({ news }: NewsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const defaultValues: Partial<NewsFormValues> = {
    title: news?.title || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    image: news?.image || "",
    category: news?.category || "",
    published_at: news?.published_at ? new Date(news.published_at) : new Date(),
    published: news?.published || false,
  }

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues,
  })

  async function onSubmit(data: NewsFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (news) {
        await updateNews(news.id, data)
      } else {
        await createNews(data)
      }
      router.push("/admin/news")
      router.refresh()
    } catch (error) {
      console.error("Error saving news:", error)
      setSubmitError(error instanceof Error ? error.message : "Помилка при збереженні новини")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{news ? "Редагувати новину" : "Створити новину"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input placeholder="Заголовок новини" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Короткий опис</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Короткий опис новини" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зміст</FormLabel>
                  <FormControl>
                    <Editor value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категорія</FormLabel>
                  <FormControl>
                    <Input placeholder="Категорія новини" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зображення</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} type="image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published_at"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата публікації</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Опубліковано</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {submitError && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                <span className="block sm:inline">{submitError}</span>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Зберегти новину"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

