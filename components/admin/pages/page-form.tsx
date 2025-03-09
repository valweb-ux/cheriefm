"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageTabs } from "@/components/admin/language-tabs"
import { Editor } from "@/components/admin/editor"
import { createPage, updatePage } from "@/lib/actions/pages"
import { MediaPicker } from "@/components/admin/media/media-picker"

const pageSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
  content: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image: z.string().optional(),
  published: z.boolean().default(false),
  language_id: z.string().min(1, { message: "Language is required." }),
})

type PageFormValues = z.infer<typeof pageSchema>

interface PageFormProps {
  page?: any
  languages: any[]
}

export function PageForm({ page, languages }: PageFormProps) {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState(languages[0]?.id || "")

  const defaultValues: Partial<PageFormValues> = {
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
    featured_image: page?.featured_image || "",
    published: page?.published || false,
    language_id: activeLanguage,
  }

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues,
  })

  async function onSubmit(data: PageFormValues) {
    try {
      if (page) {
        await updatePage(page.id, data)
      } else {
        await createPage(data)
      }
      router.push("/admin/pages")
      router.refresh()
    } catch (error) {
      console.error("Error saving page:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{page ? "Edit Page" : "Create Page"}</CardTitle>
      </CardHeader>
      <CardContent>
        <LanguageTabs languages={languages} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="page-slug" {...field} />
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} type="image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">SEO Settings</h3>

              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Meta title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Meta description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    <FormLabel>Published</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Save Page</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

