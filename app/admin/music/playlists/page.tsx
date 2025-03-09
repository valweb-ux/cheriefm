import { Suspense } from "react"
import { getPlaylists } from "@/lib/services/playlists-service"
import { PlaylistsList } from "@/components/admin/music/playlists-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { AdminLoading } from "@/components/admin/admin-loading"

export const metadata = {
  title: "Управління плейлистами | Адмін-панель | Chérie FM",
  description: "Управління плейлистами на радіостанції Chérie FM",
}

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    search?: string
    featured?: string
    active?: string
  }
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
        title="Управління плейлистами"
        description="Створюйте, редагуйте та видаляйте плейлисти"
        actions={
          <Link href="/admin/music/playlists/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Створити плейлист
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<AdminLoading />}>
        <PlaylistsListWrapper limit={limit} offset={offset} search={search} featured={featured} active={active} />
      </Suspense>
    </div>
  )
}

async function PlaylistsListWrapper({
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
  const { data: playlists, count } = await getPlaylists({
    limit,
    offset,
    search,
    featured,
    active,
  })

  return (
    <PlaylistsList
      playlists={playlists}
      totalCount={count}
      currentPage={Math.floor(offset / limit) + 1}
      pageSize={limit}
      search={search}
      featured={featured}
      active={active}
    />
  )
}

