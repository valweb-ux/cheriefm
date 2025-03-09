import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "@/components/admin/settings/general-settings"
import { ContactSettings } from "@/components/admin/settings/contact-settings"
import { SocialSettings } from "@/components/admin/settings/social-settings"
import { SeoSettings } from "@/components/admin/settings/seo-settings"
import { getSiteSettings } from "@/lib/services/settings-service"

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Налаштування сайту</h1>
        <p className="text-muted-foreground">Керуйте загальними налаштуваннями сайту</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="general">Загальні</TabsTrigger>
          <TabsTrigger value="contact">Контакти</TabsTrigger>
          <TabsTrigger value="social">Соціальні мережі</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings settings={settings} />
        </TabsContent>
        <TabsContent value="contact" className="space-y-4">
          <ContactSettings settings={settings} />
        </TabsContent>
        <TabsContent value="social" className="space-y-4">
          <SocialSettings settings={settings} />
        </TabsContent>
        <TabsContent value="seo" className="space-y-4">
          <SeoSettings settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

