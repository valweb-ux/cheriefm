"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Radio, Calendar, Settings, ChevronRight, ChevronDown } from "lucide-react"

interface AdminSidebarProps {
  collapsed: boolean
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <aside
      className={`bg-[#23282d] text-gray-200 overflow-y-auto transition-all duration-300 fixed h-full top-0 pt-14 
        ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="py-4">
        <nav>
          <ul>
            <SidebarItem
              icon={<Home size={20} />}
              title="Головна панель"
              path="/admin"
              active={pathname === "/admin"}
              collapsed={collapsed}
            />

            <SidebarItemWithSubmenu
              icon={<FileText size={20} />}
              title="Новини"
              active={isActive("/admin/news") || isActive("/admin/edit")}
              collapsed={collapsed}
              submenuItems={[
                { title: "Всі новини", path: "/admin" },
                { title: "Додати нову", path: "/admin/edit/new" },
              ]}
            />

            <SidebarItem
              icon={<Radio size={20} />}
              title="Радіостанції"
              path="/admin/radio"
              active={isActive("/admin/radio")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<Calendar size={20} />}
              title="Календар"
              path="/admin/calendar"
              active={isActive("/admin/calendar")}
              collapsed={collapsed}
            />

            <SidebarItem
              icon={<Settings size={20} />}
              title="Налаштування"
              path="/admin/settings"
              active={isActive("/admin/settings")}
              collapsed={collapsed}
            />
          </ul>
        </nav>
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  path: string
  active: boolean
  collapsed: boolean
}

function SidebarItem({ icon, title, path, active, collapsed }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={path}
        className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors
          ${active ? "bg-gray-700 border-l-4 border-blue-500" : ""}`}
      >
        <span className="mr-3">{icon}</span>
        {!collapsed && <span>{title}</span>}
      </Link>
    </li>
  )
}

interface SidebarItemWithSubmenuProps {
  icon: React.ReactNode
  title: string
  active: boolean
  collapsed: boolean
  submenuItems: { title: string; path: string }[]
}

function SidebarItemWithSubmenu({ icon, title, active, collapsed, submenuItems }: SidebarItemWithSubmenuProps) {
  const [isOpen, setIsOpen] = React.useState(active)
  const pathname = usePathname()

  return (
    <li>
      <button
        onClick={() => !collapsed && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors
          ${active ? "bg-gray-700 border-l-4 border-blue-500" : ""}`}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && <span>{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
      </button>

      {!collapsed && isOpen && (
        <ul className="bg-gray-800 pl-10">
          {submenuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`block py-2 px-4 hover:bg-gray-700 transition-colors
                  ${pathname === item.path ? "text-blue-400" : ""}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

