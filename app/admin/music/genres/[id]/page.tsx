import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { GenreForm } from "@/components/admin/music/genre-form"
import { getGenreById, getGenres } from "@/lib/services/genres-service"

export const metadata = {
  title: "Редагування жанру | Адмін-панель | Chérie FM",
  description: "Редагування музичного жанру на радіостанції Chérie FM",
}

export default async function EditGenrePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  try {
    // Отримуємо жанр за ID
    const genre = await getGenreById(params.id)

    // Отримуємо всі жанри для вибору батьківського жанру
    const { data: genres } = await getGenres({ limit: 100 })

    return (
      <div className="space-y-6">
        <AdminHeader
          title="Редагування жанру"
          description="Редагуйте інформацію про музичний жанр"
          backHref="/admin/music/genres"
        />

        <GenreForm genre={genre} genres={genres} />
      </div>
    )
  } catch (error) {
    console.error("Error loading genre:", error)
    notFound()
  }
}

