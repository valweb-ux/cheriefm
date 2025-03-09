import { Suspense } from "react"
import { getGenres } from "@/lib/services/genres-service"
import { GenresList } from "@/components/admin/music/genres-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { AdminLoading } from "@/components/admin/admin-loading"

export const metadata = {
  title: "Управління жанрами | Адмін-панель | Chérie FM",
  description: "Управління музичними жанрами на радіостанції Chérie FM",
}

export default async function GenresPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    search?: string
  }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""

  const limit = 10
  const offset = (page - 1) * limit

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Управління жанрами"
        description="Створюйте, редагуйте та видаляйте музичні жанри"
        actions={
          <Link href="/admin/music/genres/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Створити жанр
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<AdminLoading />}>
        <GenresListWrapper limit={limit} offset={offset} search={search} />
      </Suspense>
    </div>
  )
}

async function GenresListWrapper({
  limit,
  offset,
  search,
}: {
  limit: number
  offset: number
  search: string
}) {
  const { data: genres, count } = await getGenres({
    limit,
    offset,
    search,
  })

  return (
    <GenresList
      genres={genres}
      totalCount={count}
      currentPage={Math.floor(offset / limit) + 1}
      pageSize={limit}
      search={search}
    />
  )
}

