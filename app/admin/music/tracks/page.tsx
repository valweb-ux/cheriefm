import { Suspense } from "react"
import { getTracks } from "@/lib/services/tracks-service"
import { TracksList } from "@/components/admin/music/tracks-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { AdminLoading } from "@/components/admin/admin-loading"

export const metadata = {
  title: "Управління треками | Адмін-панель | Chérie FM",
  description: "Управління музичними треками на радіостанції Chérie FM",
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    search?: string
    artistId?: string
    genre?: string
    featured?: string
    active?: string
  }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""
  const artistId = searchParams.artistId || undefined
  const genre = searchParams.genre || undefined
  const featured = searchParams.featured === "true" ? true : searchParams.featured === "false" ? false : undefined
  const active = searchParams.active === "true" ? true : searchParams.active === "false" ? false : undefined

  const limit = 10
  const offset = (page - 1) * limit

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Управління треками"
        description="Створюйте, редагуйте та видаляйте музичні треки"
        actions={
          <Link href="/admin/music/tracks/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Додати трек
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<AdminLoading />}>
        <TracksListWrapper
          limit={limit}
          offset={offset}
          search={search}
          artistId={artistId}
          genre={genre}
          featured={featured}
          active={active}
        />
      </Suspense>
    </div>
  )
}

async function TracksListWrapper({
  limit,
  offset,
  search,
  artistId,
  genre,
  featured,
  active,
}: {
  limit: number
  offset: number
  search: string
  artistId?: string
  genre?: string
  featured?: boolean
  active?: boolean
}) {
  const { data: tracks, count } = await getTracks({
    limit,
    offset,
    search,
    artistId,
    genre,
    featured,
    active,
  })

  return (
    <TracksList
      tracks={tracks}
      totalCount={count}
      currentPage={Math.floor(offset / limit) + 1}
      pageSize={limit}
      search={search}
      artistId={artistId}
      genre={genre}
      featured={featured}
      active={active}
    />
  )
}

