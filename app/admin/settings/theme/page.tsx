import { ThemeSettingsForm } from "@/components/admin/settings/theme-settings-form"
import { getThemeSettings } from "@/lib/services/settings-service"

export default async function ThemeSettingsPage() {
  // Отримуємо налаштування теми
  const settings = await getThemeSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Налаштування теми</h1>
        <p className="text-muted-foreground">Керуйте виглядом та стилем сайту</p>
      </div>

      <ThemeSettingsForm settings={settings} />
    </div>
  )
}

