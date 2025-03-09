import { getChartBySlug, getChartEntries } from "@/lib/services/charts-service"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Info } from "lucide-react"
import { ChartEntry } from "@/components/music/chart-card"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const chart = await getChartBySlug(params.slug)

  if (!chart) {
    return {
      title: "Чарт не знайдено | Chérie FM",
      description: "Чарт не знайдено",
    }
  }

  return {
    title: `${chart.title_uk} | Chérie FM`,
    description: chart.description_uk || `Слухайте найпопулярніші треки в чарті ${chart.title_uk} на Chérie FM`,
  }
}

export default async function ChartPage({ params }: { params: { slug: string } }) {
  const chart = await getChartBySlug(params.slug)

  if (!chart) {
    notFound()
  }

  const entries = await getChartEntries(chart.id)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{chart.title_uk}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Оновлено {formatDate(chart.last_updated || chart.updated_at)}
          </span>
          <span className="flex items-center gap-1">
            <Info size={16} />
            {entries.length} треків
          </span>
        </div>

        {chart.description_uk && <p className="text-muted-foreground mb-6">{chart.description_uk}</p>}

        {/* Кнопки дій */}
        <Button className="gap-2">
          <Play size={18} />
          Відтворити все
        </Button>
      </div>

      {/* Список треків */}
      <div className="bg-card rounded-lg border p-4">
        <div className="space-y-2">
          {entries.map((entry) => (
            <ChartEntry
              key={`${entry.position}-${entry.track.id}`}
              position={entry.position}
              previousPosition={entry.previous_position}
              track={{
                id: entry.track.id,
                title: entry.track.title,
                cover_url: entry.track.cover_url,
                artist: {
                  id: entry.track.artist.id,
                  name: entry.track.artist.name,
                  slug: entry.track.artist.slug,
                },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

