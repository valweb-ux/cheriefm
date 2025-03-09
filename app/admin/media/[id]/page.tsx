import { MediaDetails } from "@/components/admin/media/media-details"
import { getMediaFileById } from "@/lib/supabase/media-api"
import { notFound } from "next/navigation"

interface MediaDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MediaDetailsPage({ params }: MediaDetailsPageProps) {
  try {
    const media = await getMediaFileById(params.id)

    if (!media) {
      return notFound()
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Деталі медіафайлу</h1>
          <p className="text-muted-foreground">Перегляд та редагування медіафайлу</p>
        </div>

        <MediaDetails media={media} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching media file:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Помилка</h1>
          <p className="text-destructive">Не вдалося завантажити медіафайл</p>
        </div>
      </div>
    )
  }
}

