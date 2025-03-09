"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Radio,
  FileText,
  Music,
  Calendar,
  Settings,
  Users,
  BarChart,
  MessageSquare,
  Image,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Панель", icon: Home },
  { href: "/admin/episodes", label: "Епізоди", icon: Radio },
  { href: "/admin/pages", label: "Сторінки", icon: FileText },
  { href: "/admin/music", label: "Музика", icon: Music },
  { href: "/admin/programs", label: "Програми", icon: Calendar },
  { href: "/admin/users", label: "Користувачі", icon: Users },
  { href: "/admin/analytics", label: "Аналітика", icon: BarChart },
  { href: "/admin/comments", label: "Коментарі", icon: MessageSquare },
  { href: "/admin/media", label: "Медіа", icon: Image },
  { href: "/admin/settings", label: "Налаштування", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">Chérie FM Admin</h1>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

