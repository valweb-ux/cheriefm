import { Suspense } from "react"
import { getArtists } from "@/lib/services/artists-service"
import { ArtistsList } from "@/components/admin/music/artists-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { AdminLoading } from "@/components/admin/admin-loading"

export const metadata = {
  title: "Управління артистами | Адмін-панель | Chérie FM",
  description: "Управління артистами на радіостанції Chérie FM",
}

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; featured?: string; active?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""
  const featured = searchParams.featured === "true" ? true : searchParams.featured === "false" ? false : undefined
  const active = searchParams.active === "true" ? true : searchParams.active === "false" ? false : undefined

  const limit = 10
  const offset = (page - 1) * limit

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Управління артистами"
        description="Створюйте, редагуйте та видаляйте артистів"
        actions={
          <Link href="/admin/music/artists/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Додати артиста
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<AdminLoading />}>
        <ArtistsListWrapper limit={limit} offset={offset} search={search} featured={featured} active={active} />
      </Suspense>
    </div>
  )
}

async function ArtistsListWrapper({
  limit,
  offset,
  search,
  featured,
  active,
}: {
  limit: number
  offset: number
  search: string
  featured?: boolean
  active?: boolean
}) {
  const { data: artists, count } = await getArtists({
    limit,
    offset,
    search,
    featured,
    active,
  })

  return (
    <ArtistsList
      artists={artists}
      totalCount={count}
      currentPage={Math.floor(offset / limit) + 1}
      pageSize={limit}
      search={search}
      featured={featured}
      active={active}
    />
  )
}

