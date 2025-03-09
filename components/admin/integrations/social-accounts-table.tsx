"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  TrashIcon,
  ExternalLinkIcon,
  Loader2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

import type { SocialMediaAccount } from "@/types/integrations.types"
import { disconnectSocialMediaAccount, refreshSocialMediaAccount } from "@/lib/actions/social-media-actions"

interface SocialAccountsTableProps {
  accounts: SocialMediaAccount[]
}

export default function SocialAccountsTable({ accounts }: SocialAccountsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDisconnect = async (id: string) => {
    try {
      setLoading(id)
      const result = await disconnectSocialMediaAccount(id)

      if (result.success) {
        toast({
          title: "Акаунт відключено",
          description: "Акаунт соціальної мережі успішно відключено",
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка відключення акаунту",
          description: result.error || "Не вдалося відключити акаунт соціальної мережі",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error disconnecting account:", error)
      toast({
        title: "Помилка відключення акаунту",
        description: "Сталася помилка при відключенні акаунту соціальної мережі",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRefresh = async (id: string) => {
    try {
      setLoading(id)
      const result = await refreshSocialMediaAccount(id)

      if (result.success) {
        toast({
          title: "Токен оновлено",
          description: "Токен акаунту соціальної мережі успішно оновлено",
        })
        router.refresh()
      } else {
        toast({
          title: "Помилка оновлення токену",
          description: result.error || "Не вдалося оновити токен акаунту соціальної мережі",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error refreshing account token:", error)
      toast({
        title: "Помилка оновлення токену",
        description: "Сталася помилка при оновленні токену акаунту соціальної мережі",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <FacebookIcon className="h-4 w-4 text-blue-600" />
      case "twitter":
        return <TwitterIcon className="h-4 w-4 text-sky-500" />
      case "instagram":
        return <InstagramIcon className="h-4 w-4 text-pink-600" />
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4 text-blue-700" />
      default:
        return null
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "Facebook"
      case "twitter":
        return "Twitter"
      case "instagram":
        return "Instagram"
      case "linkedin":
        return "LinkedIn"
      default:
        return platform
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Платформа</TableHead>
            <TableHead>Акаунт</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата підключення</TableHead>
            <TableHead>Термін дії токену</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Немає підключених акаунтів соціальних мереж
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(account.platform)}
                    <span>{getPlatformName(account.platform)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{account.accountName}</span>
                    <span className="text-xs text-muted-foreground">{account.accountId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {account.isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Підключено
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Відключено
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(account.connectedAt).toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {account.tokenExpiresAt ? (
                    new Date(account.tokenExpiresAt) > new Date() ? (
                      new Date(account.tokenExpiresAt).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Термін дії закінчився
                      </Badge>
                    )
                  ) : (
                    "Безстроковий"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={loading === account.id}>
                        {loading === account.id ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontalIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => window.open(account.profileUrl, "_blank")}
                        disabled={!account.profileUrl}
                      >
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        Відкрити профіль
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRefresh(account.id)}>
                        <RefreshCwIcon className="mr-2 h-4 w-4" />
                        Оновити токен
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDisconnect(account.id)} className="text-red-600">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Відключити
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

