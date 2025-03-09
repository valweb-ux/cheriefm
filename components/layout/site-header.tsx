"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Radio, Music, Newspaper, Calendar, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getRadioStreamUrl } from "@/lib/services/radio-service"
import { RadioPlayer } from "@/components/radio/radio-player"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function SiteHeader() {
  const pathname = usePathname()
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        const url = await getRadioStreamUrl()
        setStreamUrl(url)
      } catch (error) {
        console.error("Error fetching stream URL:", error)
      }
    }

    fetchStreamUrl()
  }, [])

  const navItems: NavItem[] = [
    {
      title: "Головна",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      title: "Радіо",
      href: "/radio",
      icon: <Radio size={20} />,
    },
    {
      title: "Музика",
      href: "/music",
      icon: <Music size={20} />,
    },
    {
      title: "Новини",
      href: "/news",
      icon: <Newspaper size={20} />,
    },
    {
      title: "Програми",
      href: "/programs",
      icon: <Calendar size={20} />,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg?height=40&width=120" alt="Chérie FM" width={120} height={40} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {streamUrl && (
            <div className="hidden md:block">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowMiniPlayer(!showMiniPlayer)}>
                <Radio size={16} />
                Слухати радіо
              </Button>

              {showMiniPlayer && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                  <RadioPlayer streamUrl={streamUrl} compact />
                </div>
              )}
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-8">
                <Image src="/placeholder.svg?height=40&width=120" alt="Chérie FM" width={120} height={40} />
              </Link>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 p-2 rounded-md",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>

              {streamUrl && (
                <div className="mt-8 pt-4 border-t">
                  <RadioPlayer streamUrl={streamUrl} />
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

