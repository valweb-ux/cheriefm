import { Suspense } from "react"
import { getSocialMediaAccounts } from "@/lib/services/social-media-service"
import { getSocialMediaPosts } from "@/lib/services/social-media-service"
import SocialMediaTabs from "@/components/admin/integrations/social-media-tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface SocialMediaPageProps {
  searchParams: {
    tab?: string
    status?: string
    page?: string
    perPage?: string
  }
}

export default async function SocialMediaPage({ searchParams }: SocialMediaPageProps) {
  const tab = searchParams.tab || "accounts"
  const status = searchParams.status || "all"
  const page = Number.parseInt(searchParams.page || "1")
  const perPage = Number.parseInt(searchParams.perPage || "10")

  try {
    const accounts = await getSocialMediaAccounts()
    const { posts, count } = await getSocialMediaPosts(
      perPage,
      (page - 1) * perPage,
      status !== "all" ? status : undefined,
    )

    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Інтеграція з соціальними мережами</h1>
        </div>

        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <SocialMediaTabs
            accounts={accounts}
            posts={posts}
            count={count}
            tab={tab}
            status={status}
            page={page}
            perPage={perPage}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error loading social media data:", error)
    return (
      <div className="container py-6">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
          Помилка завантаження даних соціальних мереж. Спробуйте пізніше.
        </div>
      </div>
    )
  }
}

