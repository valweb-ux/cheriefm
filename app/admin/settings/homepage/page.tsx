import { HomepageSettings } from "@/components/admin/settings/homepage-settings"
import { getHomepageSettings } from "@/lib/services/settings-service"

export default async function HomepageSettingsPage() {
  const settings = await getHomepageSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Налаштування головної сторінки</h1>
        <p className="text-muted-foreground">Керуйте вмістом та відображенням головної сторінки</p>
      </div>

      <HomepageSettings settings={settings} />
    </div>
  )
}

