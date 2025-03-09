import { Suspense } from "react"
import { StreamingSettingsForm } from "@/components/admin/settings/streaming-settings-form"
import { getSiteSettings } from "@/lib/services/settings-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioAdvertsManager } from "@/components/admin/settings/radio-adverts-manager"
import { RadioAdvertSettingsForm } from "@/components/admin/settings/radio-advert-settings-form"

export default async function StreamingSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Налаштування стрімінгу</h1>
        <p className="text-muted-foreground">Керуйте налаштуваннями онлайн-трансляції радіо та рекламними роликами</p>
      </div>

      <Tabs defaultValue="streaming">
        <TabsList>
          <TabsTrigger value="streaming">Налаштування стрімінгу</TabsTrigger>
          <TabsTrigger value="adverts">Рекламні ролики</TabsTrigger>
          <TabsTrigger value="advert-settings">Налаштування реклами</TabsTrigger>
        </TabsList>

        <TabsContent value="streaming" className="space-y-4 mt-4">
          <Suspense fallback={<div>Завантаження...</div>}>
            <StreamingSettingsForm settings={settings} />
          </Suspense>
        </TabsContent>

        <TabsContent value="adverts" className="space-y-4 mt-4">
          <Suspense fallback={<div>Завантаження...</div>}>
            <RadioAdvertsManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="advert-settings" className="space-y-4 mt-4">
          <Suspense fallback={<div>Завантаження...</div>}>
            <RadioAdvertSettingsForm />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

