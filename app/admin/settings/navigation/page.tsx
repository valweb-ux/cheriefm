import { NavigationManager } from "@/components/admin/settings/navigation-manager"
import { getAllNavigationItems } from "@/lib/services/settings-service"

export default async function NavigationSettingsPage() {
  const navigationItems = await getAllNavigationItems()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Управління навігацією</h1>
        <p className="text-muted-foreground">Керуйте пунктами меню сайту</p>
      </div>

      <NavigationManager items={navigationItems} />
    </div>
  )
}

