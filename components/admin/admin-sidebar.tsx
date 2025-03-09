"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Newspaper, Music, Radio, Users, FileText, Home, Settings, Menu, X, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  {
    title: "Дашборд",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Новини",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Медіафайли",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Музика",
    href: "/admin/music",
    icon: Music,
  },
  {
    title: "Програми",
    href: "/admin/programs",
    icon: Radio,
  },
  {
    title: "Виконавці",
    href: "/admin/artists",
    icon: Users,
  },
  {
    title: "Сторінки",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Головна сторінка",
    href: "/admin/homepage",
    icon: Home,
  },
  {
    title: "Налаштування",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Шері ФМ</span>
          </Link>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-pink-100 text-pink-600"
                  : "text-gray-600 hover:bg-gray-100",
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

