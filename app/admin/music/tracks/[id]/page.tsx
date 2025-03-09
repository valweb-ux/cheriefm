import { notFound } from "next/navigation"
import { getTrackById } from "@/lib/services/tracks-service"
import { getArtists } from "@/lib/services/artists-service"
import { getGenres } from "@/lib/services/genres-service"
import { TrackForm } from "@/components/admin/music/track-form"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Редагування треку | Адмін-панель | Chérie FM",
  description: "Редагування інформації про музичний трек на радіостанції Chérie FM",
}

export default async function EditTrackPage({
  params,
}: {
  params: { id: string }
}) {
  // Якщо id === "new", це сторінка створення нового треку
  const isNewTrack = params.id === "new"

  let track = null
  if (!isNewTrack) {
    try {
      track = await getTrackById(params.id)
    } catch (error) {
      notFound()
    }
  }

  // Отримуємо список артистів для вибору
  const { data: artists } = await getArtists({ limit: 100, active: true })

  // Отримуємо список жанрів
  const genres = await getGenres()

  return (
    <div className="space-y-6">
      <AdminHeader
        title={isNewTrack ? "Створення треку" : "Редагування треку"}
        description={
          isNewTrack
            ? "Створіть новий музичний трек для радіостанції"
            : `Редагування інформації про трек: ${track?.title}`
        }
        actions={
          <Link href="/admin/music/tracks">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Назад до списку
            </Button>
          </Link>
        }
      />

      <TrackForm track={track} artists={artists} genres={genres} />
    </div>
  )
}

