import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { PlaylistForm } from "@/components/admin/music/playlist-form"
import { getPlaylistById } from "@/lib/services/playlists-service"
import { getTracks } from "@/lib/services/tracks-service"

export const metadata = {
  title: "Редагування плейлиста | Адмін-панель | Chérie FM",
  description: "Редагування плейлиста на радіостанції Chérie FM",
}

export default async function EditPlaylistPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  try {
    // Отримуємо плейлист за ID
    const playlist = await getPlaylistById(params.id)

    // Отримуємо всі треки для вибору
    const { data: tracks } = await getTracks({
      limit: 1000,
      active: true,
      orderBy: "title",
      orderDirection: "asc",
    })

    return (
      <div className="space-y-6">
        <AdminHeader
          title="Редагування плейлиста"
          description="Редагуйте інформацію про плейлист"
          backHref="/admin/music/playlists"
        />

        <PlaylistForm playlist={playlist} tracks={tracks} userId={session.user.id} />
      </div>
    )
  } catch (error) {
    console.error("Error loading playlist:", error)
    notFound()
  }
}

