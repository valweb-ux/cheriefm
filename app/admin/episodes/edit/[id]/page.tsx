import { EpisodeForm } from "@/components/admin/episodes/episode-form"

interface EditEpisodePageProps {
  params: {
    id: string
  }
}

export default function EditEpisodePage({ params }: EditEpisodePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування епізоду</h1>
        <p className="text-muted-foreground">Внесіть зміни до епізоду програми</p>
      </div>

      <EpisodeForm id={params.id} />
    </div>
  )
}

