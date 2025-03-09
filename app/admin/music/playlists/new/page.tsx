import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { PlaylistForm } from "@/components/admin/music/playlist-form"
import { getTracks } from "@/lib/services/tracks-service"

export const metadata = {
  title: "Створення плейлиста | Адмін-панель | Chérie FM",
  description: "Створення нового плейлиста на радіостанції Chérie FM",
}

export default async function NewPlaylistPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

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
        title="Створення плейлиста"
        description="Створіть новий плейлист для радіостанції"
        backHref="/admin/music/playlists"
      />

      <PlaylistForm playlist={null} tracks={tracks} userId={session.user.id} />
    </div>
  )
}

