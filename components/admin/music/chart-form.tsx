"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import ImageUpload from "@/components/admin/image-upload"
import { createChart, updateChart } from "@/lib/services/charts-service"
import { slugify } from "@/lib/utils"
import type { Chart } from "@/types/music.types"

const chartFormSchema = z.object({
  title: z.string().min(2, {
    message: "Назва чарту повинна містити щонайменше 2 символи",
  }),
  slug: z.string().min(2, {
    message: "Slug повинен містити щонайменше 2 символи",
  }),
  description_uk: z.string().optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  cover_url: z.string().optional(),
  is_active: z.boolean().default(true),
  period_start: z.date(),
  period_end: z.date(),
})

type ChartFormValues = z.infer<typeof chartFormSchema>

interface ChartFormProps {
  chart?: Chart
}

export default function ChartForm({ chart }: ChartFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<ChartFormValues> = {
    title: chart?.title || "",
    slug: chart?.slug || "",
    description_uk: chart?.description_uk || "",
    description_fr: chart?.description_fr || "",
    description_en: chart?.description_en || "",
    cover_url: chart?.cover_url || "",
    is_active: chart?.is_active ?? true,
    period_start: chart?.period_start ? new Date(chart.period_start) : new Date(),
    period_end: chart?.period_end ? new Date(chart.period_end) : new Date(),
  }

  const form = useForm<ChartFormValues>({
    resolver: zodResolver(chartFormSchema),
    defaultValues,
  })

  const watchTitle = form.watch("title")

  const generateSlug = () => {
    const slug = slugify(watchTitle)
    form.setValue("slug", slug)
  }

  const onSubmit = async (data: ChartFormValues) => {
    try {
      setIsSubmitting(true)

      const chartData = {
        title: data.title,
        slug: data.slug,
        description_uk: data.description_uk || null,
        description_fr: data.description_fr || null,
        description_en: data.description_en || null,
        cover_url: data.cover_url || null,
        is_active: data.is_active,
        period_start: data.period_start.toISOString(),
        period_end: data.period_end.toISOString(),
      }

      if (chart) {
        await updateChart(chart.id, chartData)
        toast({
          title: "Успішно",
          description: "Чарт оновлено",
        })
      } else {
        await createChart(chartData)
        toast({
          title: "Успішно",
          description: "Чарт створено",
        })
      }

      router.push("/admin/music/charts")
    } catch (error) {
      console.error("Error submitting chart form:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти чарт",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Назва чарту</FormLabel>
                      <FormControl>
                        <Input placeholder="Топ 10 українських хітів" {...field} />
                      </FormControl>
                      <FormDescription>Введіть назву чарту, яка буде відображатися на сайті</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="top-10-ukrainian-hits" {...field} />
                        </FormControl>
                        <FormDescription>URL-адреса чарту на сайті</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Згенерувати
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="period_start"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Початок періоду</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                {field.value ? format(field.value, "PPP", { locale: uk }) : <span>Виберіть дату</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="period_end"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Кінець періоду</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                {field.value ? format(field.value, "PPP", { locale: uk }) : <span>Виберіть дату</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Активний чарт</FormLabel>
                        <FormDescription>Чарт буде відображатися на сайті, якщо він активний</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Обкладинка чарту</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value || ""} onChange={field.onChange} folder="charts" />
                      </FormControl>
                      <FormDescription>
                        Завантажте зображення для чарту (рекомендований розмір: 1200x630)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Tabs defaultValue="uk" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="uk">Українська</TabsTrigger>
                    <TabsTrigger value="fr">Французька</TabsTrigger>
                    <TabsTrigger value="en">Англійська</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uk" className="mt-4">
                    <FormField
                      control={form.control}
                      name="description_uk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Опис (українською)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Опис чарту українською мовою" className="min-h-[200px]" {...field} />
                          </FormControl>
                          <FormDescription>Введіть опис чарту українською мовою</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="fr" className="mt-4">
                    <FormField
                      control={form.control}
                      name="description_fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Опис (французькою)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Опис чарту французькою мовою" className="min-h-[200px]" {...field} />
                          </FormControl>
                          <FormDescription>Введіть опис чарту французькою мовою</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="en" className="mt-4">
                    <FormField
                      control={form.control}
                      name="description_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Опис (англійською)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Опис чарту англійською мовою" className="min-h-[200px]" {...field} />
                          </FormControl>
                          <FormDescription>Введіть опис чарту англійською мовою</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/music/charts")}>
                Скасувати
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Збереження..." : chart ? "Оновити чарт" : "Створити чарт"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

