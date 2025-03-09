import { notFound } from "next/navigation"
import { getArtistById } from "@/lib/services/artists-service"
import { ArtistForm } from "@/components/admin/music/artist-form"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Редагування артиста | Адмін-панель | Chérie FM",
  description: "Редагування інформації про артиста на радіостанції Chérie FM",
}

export default async function EditArtistPage({
  params,
}: {
  params: { id: string }
}) {
  // Якщо id === "new", це сторінка створення нового артиста
  const isNewArtist = params.id === "new"

  let artist = null
  if (!isNewArtist) {
    try {
      artist = await getArtistById(params.id)
    } catch (error) {
      notFound()
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={isNewArtist ? "Створення артиста" : "Редагування артиста"}
        description={
          isNewArtist
            ? "Створіть нового артиста для радіостанції"
            : `Редагування інформації про артиста: ${artist?.name}`
        }
        actions={
          <Link href="/admin/music/artists">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Назад до списку
            </Button>
          </Link>
        }
      />

      <ArtistForm artist={artist} />
    </div>
  )
}

