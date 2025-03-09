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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createEpisode, updateEpisode } from "@/lib/actions/episodes"
import { LanguageTabs } from "@/components/admin/language-tabs"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { DatePicker } from "@/components/ui/date-picker"

const episodeSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  program_id: z.string().min(1, { message: "Please select a program." }),
  image_url: z.string().optional(),
  audio_url: z.string().min(1, { message: "Audio file is required." }),
  published_at: z.date().optional(),
  published: z.boolean().default(false),
  language_id: z.string().min(1, { message: "Language is required." }),
})

type EpisodeFormValues = z.infer<typeof episodeSchema>

interface EpisodeFormProps {
  episode?: any
  programs: any[]
  languages: any[]
}

export function EpisodeForm({ episode, programs, languages }: EpisodeFormProps) {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState(languages[0]?.id || "")

  const defaultValues: Partial<EpisodeFormValues> = {
    title: episode?.title || "",
    description: episode?.description || "",
    program_id: episode?.program_id || "",
    image_url: episode?.image_url || "",
    audio_url: episode?.audio_url || "",
    published_at: episode?.published_at ? new Date(episode.published_at) : new Date(),
    published: episode?.published || false,
    language_id: activeLanguage,
  }

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues,
  })

  async function onSubmit(data: EpisodeFormValues) {
    try {
      if (episode) {
        await updateEpisode(episode.id, data)
      } else {
        await createEpisode(data)
      }
      router.push("/admin/episodes")
      router.refresh()
    } catch (error) {
      console.error("Error saving episode:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{episode ? "Edit Episode" : "Create Episode"}</CardTitle>
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
                    <Input placeholder="Episode title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Episode description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.title}
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
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} type="image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audio_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} type="audio" />
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
                  <FormLabel>Publish Date</FormLabel>
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
                    <FormLabel>Published</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Save Episode</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

