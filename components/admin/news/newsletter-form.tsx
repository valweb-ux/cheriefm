"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, MailIcon, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Editor } from "@/components/editor"

import type { News } from "@/types/news.types"
import type { Newsletter } from "@/types/integrations.types"
import { createNewsletterCampaign } from "@/lib/actions/newsletter-actions"

const formSchema = z.object({
  subject: z.string().min(1, "Тема листа обов'язкова"),
  content: z.string().min(1, "Вміст листа обов'язковий"),
  newsletterIds: z.array(z.string()).min(1, "Виберіть хоча б одну розсилку"),
  scheduleEmail: z.boolean().default(false),
  scheduledFor: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NewsletterFormProps {
  news: News
  newsletters: Newsletter[]
}

export default function NewsletterForm({ news, newsletters }: NewsletterFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: `${news.title}`,
      content: generateDefaultEmailContent(news),
      newsletterIds: [],
      scheduleEmail: false,
    },
  })

  const watchScheduleEmail = form.watch("scheduleEmail")

  function generateDefaultEmailContent(news: News): string {
    return `
      <h1>${news.title}</h1>
      <p>${news.description || ""}</p>
      <p>Читати повністю: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/news/${news.slug}">${news.title}</a></p>
      <p>З повагою,<br>Команда Cherie FM</p>
    `
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      const result = await createNewsletterCampaign({
        subject: values.subject,
        content: values.content,
        newsletterIds: values.newsletterIds,
        scheduledFor: values.scheduleEmail ? values.scheduledFor : undefined,
        newsId: news.id,
      })

      if (result.success) {
        toast({
          title: values.scheduleEmail ? "Розсилку заплановано" : "Розсилку створено",
          description: values.scheduleEmail
            ? `Розсилку заплановано на ${format(values.scheduledFor!, "PPP", { locale: uk })}`
            : "Розсилку успішно створено та відправлено підписникам",
        })
        router.push("/admin/news")
      } else {
        toast({
          title: "Помилка створення розсилки",
          description: result.error || "Не вдалося створити розсилку",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating newsletter campaign:", error)
      toast({
        title: "Помилка створення розсилки",
        description: "Сталася помилка при створенні розсилки",
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
            <TabsTrigger value="settings">Налаштування</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема листа</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть тему листа" {...field} />
                  </FormControl>
                  <FormDescription>Тема листа, яку побачать підписники</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вміст листа</FormLabel>
                  <FormControl>
                    <Editor value={field.value} onChange={field.onChange} placeholder="Введіть вміст листа" />
                  </FormControl>
                  <FormDescription>HTML-вміст листа для розсилки</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="newsletterIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Розсилки</FormLabel>
                    <FormDescription>Виберіть розсилки, підписникам яких буде надіслано лист</FormDescription>
                  </div>
                  {newsletters.length > 0 ? (
                    <div className="space-y-2">
                      {newsletters.map((newsletter) => (
                        <FormField
                          key={newsletter.id}
                          control={form.control}
                          name="newsletterIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={newsletter.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(newsletter.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, newsletter.id])
                                        : field.onChange(field.value?.filter((value) => value !== newsletter.id))
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal cursor-pointer">{newsletter.name}</FormLabel>
                                  <FormDescription>{newsletter.subscriberCount} підписників</FormDescription>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border rounded-md bg-muted">
                      <p className="text-sm text-muted-foreground">
                        Немає доступних розсилок. Перейдіть до налаштувань розсилок, щоб створити нову розсилку.
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Запланувати розсилку</FormLabel>
                    <FormDescription>Відправити розсилку пізніше</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchScheduleEmail && (
              <FormField
                control={form.control}
                name="scheduledFor"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата та час розсилки</FormLabel>
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
                    <FormDescription>Виберіть дату та час для запланованої розсилки</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isSubmitting || newsletters.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Обробка...
              </>
            ) : watchScheduleEmail ? (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Запланувати
              </>
            ) : (
              <>
                <MailIcon className="mr-2 h-4 w-4" />
                Відправити
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

