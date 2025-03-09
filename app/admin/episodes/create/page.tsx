import { EpisodeForm } from "@/components/admin/episodes/episode-form"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateEpisodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Створення епізоду</h1>
        <p className="text-muted-foreground">Додайте новий епізод програми</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <EpisodeForm />
      </Suspense>
    </div>
  )
}

