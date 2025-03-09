import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { GenreForm } from "@/components/admin/music/genre-form"
import { getGenres } from "@/lib/services/genres-service"

export const metadata = {
  title: "Створення жанру | Адмін-панель | Chérie FM",
  description: "Створення нового музичного жанру на радіостанції Chérie FM",
}

export default async function NewGenrePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  // Отримуємо всі жанри для вибору батьківського жанру
  const { data: genres } = await getGenres({ limit: 100 })

  return (
    <div className="space-y-6">
      <AdminHeader title="Створення жанру" description="Створіть новий музичний жанр" backHref="/admin/music/genres" />

      <GenreForm genre={null} genres={genres} />
    </div>
  )
}

