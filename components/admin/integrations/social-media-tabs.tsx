"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  PlusIcon,
  RefreshCwIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  Loader2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

import type { SocialMediaAccount, SocialMediaPost } from "@/types/integrations.types"
import SocialAccountsTable from "@/components/admin/integrations/social-accounts-table"
import SocialPostsTable from "@/components/admin/integrations/social-posts-table"
import { refreshSocialMediaTokens } from "@/lib/actions/social-media-actions"

interface SocialMediaTabsProps {
  accounts: SocialMediaAccount[]
  posts: SocialMediaPost[]
  count: number
  tab: string
  status: string
  page: number
  perPage: number
}

export default function SocialMediaTabs({ accounts, posts, count, tab, status, page, perPage }: SocialMediaTabsProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleTabChange = (value: string) => {
    router.push(`/admin/integrations/social-media?tab=${value}`)
  }

  const handleRefreshTokens = async () => {
    try {
      setIsRefreshing(true)
      const result = await refreshSocialMediaTokens()

      if (result.success) {
        toast({
          title: "Токени оновлено",
          description: "Токени соціальних мереж успішно оновлено",
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка оновлення токенів",
          description: result.error || "Не вдалося оновити токени соціальних мереж",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error refreshing tokens:", error)
      toast({
        title: "Помилка оновлення токенів",
        description: "Сталася помилка при оновленні токенів соціальних мереж",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="accounts">Акаунти</TabsTrigger>
          <TabsTrigger value="posts">Публікації</TabsTrigger>
        </TabsList>

        <div className="flex space-x-2">
          {tab === "accounts" && (
            <>
              <Button variant="outline" size="sm" onClick={handleRefreshTokens} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                )}
                Оновити токени
              </Button>
              <Button asChild>
                <Link href="/admin/integrations/social-media/connect">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Підключити акаунт
                </Link>
              </Button>
            </>
          )}

          {tab === "posts" && (
            <Button asChild>
              <Link href="/admin/integrations/social-media/create-post">
                <PlusIcon className="mr-2 h-4 w-4" />
                Створити публікацію
              </Link>
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="accounts" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded-md bg-card flex flex-col items-center justify-center">
            <FacebookIcon className="h-8 w-8 text-blue-600 mb-2" />
            <p className="font-medium">Facebook</p>
            <p className="text-sm text-muted-foreground">
              {accounts.filter((a) => a.platform === "facebook" && a.isConnected).length} підключено
            </p>
          </div>

          <div className="p-4 border rounded-md bg-card flex flex-col items-center justify-center">
            <TwitterIcon className="h-8 w-8 text-sky-500 mb-2" />
            <p className="font-medium">Twitter</p>
            <p className="text-sm text-muted-foreground">
              {accounts.filter((a) => a.platform === "twitter" && a.isConnected).length} підключено
            </p>
          </div>

          <div className="p-4 border rounded-md bg-card flex flex-col items-center justify-center">
            <InstagramIcon className="h-8 w-8 text-pink-600 mb-2" />
            <p className="font-medium">Instagram</p>
            <p className="text-sm text-muted-foreground">
              {accounts.filter((a) => a.platform === "instagram" && a.isConnected).length} підключено
            </p>
          </div>

          <div className="p-4 border rounded-md bg-card flex flex-col items-center justify-center">
            <LinkedinIcon className="h-8 w-8 text-blue-700 mb-2" />
            <p className="font-medium">LinkedIn</p>
            <p className="text-sm text-muted-foreground">
              {accounts.filter((a) => a.platform === "linkedin" && a.isConnected).length} підключено
            </p>
          </div>
        </div>

        <SocialAccountsTable accounts={accounts} />
      </TabsContent>

      <TabsContent value="posts" className="mt-0">
        <SocialPostsTable posts={posts} count={count} page={page} perPage={perPage} status={status} />
      </TabsContent>
    </Tabs>
  )
}

