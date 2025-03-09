import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard"
import { getAnalyticsDashboardData } from "@/lib/services/analytics-service"

export default async function AnalyticsPage() {
  // Отримуємо дані за останні 30 днів
  const endDate = new Date().toISOString()
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const dashboardData = await getAnalyticsDashboardData(startDate, endDate)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналітика</h1>
        <p className="text-muted-foreground">Перегляд статистики відвідувань та прослуховувань</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Огляд</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="audience">Аудиторія</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsDashboard data={dashboardData} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Популярні сторінки</h2>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Сторінка</th>
                      <th className="p-2 text-right">Перегляди</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topPages.map((page, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{page.path}</td>
                        <td className="p-2 text-right">{page.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Популярні треки</h2>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Трек</th>
                      <th className="p-2 text-right">Прослуховування</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topTracks.map((track, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {track.title} - {track.artist}
                        </td>
                        <td className="p-2 text-right">{track.plays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Пристрої</h2>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Пристрій</th>
                      <th className="p-2 text-right">Кількість</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.deviceDistribution.map((device, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{device.device}</td>
                        <td className="p-2 text-right">{device.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Країни</h2>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Країна</th>
                      <th className="p-2 text-right">Кількість</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.countryDistribution.map((country, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{country.country}</td>
                        <td className="p-2 text-right">{country.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

