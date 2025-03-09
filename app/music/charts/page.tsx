import { getActiveCharts } from "@/lib/services/charts-service"
import { ChartCard } from "@/components/music/chart-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata = {
  title: "Чарти | Chérie FM",
  description: "Слухайте найпопулярніші треки в чартах Chérie FM",
}

export default async function ChartsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Отримуємо параметри з URL
  const search = typeof searchParams.q === "string" ? searchParams.q : ""

  // Отримуємо дані
  const charts = await getActiveCharts()

  // Для кожного чарту отримуємо записи
  const chartsWithEntries = await Promise.all(
    charts.map(async (chart) => {
      const { getChartEntries } = await import("@/lib/services/charts-service")
      const entries = await getChartEntries(chart.id)
      return {
        ...chart,
        entries,
      }
    }),
  )

  // Фільтруємо чарти відповідно до параметрів пошуку
  const filteredCharts = search
    ? chartsWithEntries.filter(
        (chart) =>
          chart.title_uk.toLowerCase().includes(search.toLowerCase()) ||
          (chart.description_uk && chart.description_uk.toLowerCase().includes(search.toLowerCase())),
      )
    : chartsWithEntries

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Чарти</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Пошук чартів" className="pl-10" defaultValue={search} />
        </div>
      </div>

      {filteredCharts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCharts.map((chart) => (
            <ChartCard
              key={chart.id}
              id={chart.id}
              title={chart.title_uk}
              description={chart.description_uk}
              slug={chart.slug}
              entries={chart.entries.map((entry) => ({
                position: entry.position,
                previousPosition: entry.previous_position,
                track: {
                  id: entry.track.id,
                  title: entry.track.title,
                  cover_url: entry.track.cover_url,
                  artist: {
                    id: entry.track.artist.id,
                    name: entry.track.artist.name,
                    slug: entry.track.artist.slug,
                  },
                },
              }))}
              limit={10}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Не знайдено чартів, що відповідають вашому запиту</p>
        </div>
      )}
    </div>
  )
}

