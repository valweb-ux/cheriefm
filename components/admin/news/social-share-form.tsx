"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Share2Icon, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

import type { News } from "@/types/news.types"
import type { SocialMediaAccount, SocialPlatform } from "@/types/integrations.types"
import { createSocialMediaPost } from "@/lib/actions/social-media-actions"

const formSchema = z.object({
  content: z.string().min(1, "Текст публікації обов'язковий").max(2000, "Текст публікації занадто довгий"),
  imageUrl: z.string().optional(),
  link: z.string().url("Введіть коректне посилання").optional().or(z.literal("")),
  platforms: z.array(z.string()).min(1, "Виберіть хоча б одну платформу"),
  scheduledFor: z.date().optional(),
  schedulePost: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface SocialShareFormProps {
  news: News
  socialAccounts: SocialMediaAccount[]
}

export default function SocialShareForm({ news, socialAccounts }: SocialShareFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const availablePlatforms = socialAccounts
    .filter((account) => account.isConnected)
    .reduce((acc, account) => {
      if (!acc.includes(account.platform)) {
        acc.push(account.platform)
      }
      return acc
    }, [] as SocialPlatform[])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: `${news.title}\n\n${news.description?.substring(0, 200)}${news.description && news.description.length > 200 ? "..." : ""}`,
      imageUrl: news.featuredImage || "",
      link: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${news.slug}`,
      platforms: [],
      schedulePost: false,
    },
  })

  const watchSchedulePost = form.watch("schedulePost")
  const watchImageUrl = form.watch("imageUrl")

  useEffect(() => {
    setPreviewImage(watchImageUrl || null)
  }, [watchImageUrl])

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      const result = await createSocialMediaPost({
        content: values.content,
        imageUrl: values.imageUrl,
        link: values.link,
        platforms: values.platforms as SocialPlatform[],
        scheduledFor: values.schedulePost ? values.scheduledFor : undefined,
        newsId: news.id,
      })

      if (result.success) {
        toast({
          title: values.schedulePost ? "Публікацію заплановано" : "Опубліковано успішно",
          description: values.schedulePost
            ? `Публікацію заплановано на ${format(values.scheduledFor!, "PPP", { locale: uk })}`
            : "Публікацію успішно відправлено в соціальні мережі",
        })
        router.push("/admin/news")
      } else {
        toast({
          title: "Помилка публікації",
          description: result.error || "Не вдалося опублікувати в соціальних мережах",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing to social media:", error)
      toast({
        title: "Помилка публікації",
        description: "Сталася помилка при публікації в соціальних мережах",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="preview">Попередній перегляд</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текст публікації</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введіть текст для публікації в соціальних мережах"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Максимальна довжина: Twitter - 280 символів, Facebook та Instagram - 2200 символів
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL зображення</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>
                    Зображення для публікації (необов'язково для Twitter та Facebook, обов'язково для Instagram)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Посилання</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/news/article" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Посилання на новину (за замовчуванням - посилання на сайті)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platforms"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Платформи</FormLabel>
                    <FormDescription>Виберіть соціальні мережі для публікації</FormDescription>
                  </div>
                  {availablePlatforms.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availablePlatforms.map((platform) => (
                        <FormField
                          key={platform}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={platform}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, platform])
                                        : field.onChange(field.value?.filter((value) => value !== platform))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {platform === "facebook" && "Facebook"}
                                  {platform === "twitter" && "Twitter"}
                                  {platform === "instagram" && "Instagram"}
                                  {platform === "linkedin" && "LinkedIn"}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border rounded-md bg-muted">
                      <p className="text-sm text-muted-foreground">
                        Немає підключених соціальних мереж. Перейдіть до налаштувань інтеграцій, щоб підключити
                        соціальні мережі.
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedulePost"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Запланувати публікацію</FormLabel>
                    <FormDescription>Опублікувати в соціальних мережах пізніше</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchSchedulePost && (
              <FormField
                control={form.control}
                name="scheduledFor"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата та час публікації</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm", { locale: uk })
                            ) : (
                              <span>Виберіть дату та час</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={uk}
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(":")
                              const newDate = field.value || new Date()
                              newDate.setHours(Number.parseInt(hours, 10))
                              newDate.setMinutes(Number.parseInt(minutes, 10))
                              field.onChange(newDate)
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Виберіть дату та час для запланованої публікації</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Facebook</CardTitle>
                  <CardDescription>Попередній перегляд для Facebook</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold">CF</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Cherie FM</p>
                      <p className="text-xs text-muted-foreground">Щойно</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-line">{form.getValues("content")}</p>
                    {previewImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-md">
                        <Image
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                          onError={() => setPreviewImage(null)}
                        />
                      </div>
                    )}
                    {form.getValues("link") && (
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted p-2 text-xs truncate">{form.getValues("link")}</div>
                        <div className="p-2">
                          <p className="font-semibold text-sm">{news.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{news.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Twitter</CardTitle>
                  <CardDescription>Попередній перегляд для Twitter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold">CF</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <p className="text-sm font-semibold">Cherie FM</p>
                        <p className="text-xs text-muted-foreground">@cheriefm</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-line">{form.getValues("content").substring(0, 280)}</p>
                    {form.getValues("content").length > 280 && (
                      <p className="text-xs text-destructive">
                        Увага: текст перевищує ліміт у 280 символів для Twitter
                      </p>
                    )}
                    {previewImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-md">
                        <Image
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                          onError={() => setPreviewImage(null)}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isSubmitting || availablePlatforms.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Публікація...
              </>
            ) : watchSchedulePost ? (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Запланувати
              </>
            ) : (
              <>
                <Share2Icon className="mr-2 h-4 w-4" />
                Опублікувати
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

