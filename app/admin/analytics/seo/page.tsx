import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeoSettingsForm } from "@/components/admin/analytics/seo-settings-form"
import { getSeoSettings } from "@/lib/services/analytics-service"

export default async function SeoSettingsPage() {
  const seoSettings = await getSeoSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO налаштування</h1>
        <p className="text-muted-foreground">Керуйте налаштуваннями пошукової оптимізації</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">Загальні</TabsTrigger>
          <TabsTrigger value="social">Соціальні мережі</TabsTrigger>
          <TabsTrigger value="advanced">Розширені</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <SeoSettingsForm settings={seoSettings} activeTab="general" />
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <SeoSettingsForm settings={seoSettings} activeTab="social" />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <SeoSettingsForm settings={seoSettings} activeTab="advanced" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

