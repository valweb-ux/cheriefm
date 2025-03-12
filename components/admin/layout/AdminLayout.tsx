"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Radio, Calendar, Settings, Menu, Bell, User, LogOut } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1]">
      {/* WordPress-подібний хедер */}
      <header className="bg-[#1d2327] text-white h-[32px] fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm hover:text-[#00b9eb]">
              Перейти на сайт
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm hover:text-[#00b9eb]">
              <Bell size={16} />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-sm hover:text-[#00b9eb] flex items-center"
              >
                <User size={16} className="mr-1" />
                <span>Адміністратор</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Профіль
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Налаштування
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center text-red-500">
                      <LogOut size={16} className="mr-2" />
                      Вийти
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* WordPress-подібний сайдбар */}
      <div className="flex">
        <aside
          className={`bg-[#23282d] text-[#eee] fixed h-full top-[32px] transition-all duration-300 z-40
            ${sidebarCollapsed ? "w-[36px]" : "w-[160px]"}`}
        >
          <div className="py-4">
            <div className="px-4 py-2 mb-4">
              <button onClick={toggleSidebar} className="text-[#eee] hover:text-white">
                <Menu size={20} />
              </button>
            </div>
            <nav>
              <ul>
                <li>
                  <Link
                    href="/admin"
                    className={`flex items-center px-4 py-2 hover:bg-[#32373c] hover:text-white transition-colors
                      ${pathname === "/admin" ? "bg-[#0073aa] text-white" : ""}`}
                  >
                    <Home size={18} className="mr-2" />
                    {!sidebarCollapsed && <span>Головна панель</span>}
                  </Link>
                </li>
                <li>
                  <div className={`px-4 py-2 text-[#eee] ${!sidebarCollapsed ? "mt-4 mb-1" : "my-2"}`}>
                    {!sidebarCollapsed && <span className="text-xs uppercase opacity-50">Контент</span>}
                  </div>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className={`flex items-center px-4 py-2 hover:bg-[#32373c] hover:text-white transition-colors
                      ${isActive("/admin/news") || isActive("/admin/edit") ? "bg-[#0073aa] text-white" : ""}`}
                  >
                    <FileText size={18} className="mr-2" />
                    {!sidebarCollapsed && <span>Новини</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/radio"
                    className={`flex items-center px-4 py-2 hover:bg-[#32373c] hover:text-white transition-colors
                      ${isActive("/admin/radio") ? "bg-[#0073aa] text-white" : ""}`}
                  >
                    <Radio size={18} className="mr-2" />
                    {!sidebarCollapsed && <span>Радіостанції</span>}
                  </Link>
                </li>
                <li>
                  <div className={`px-4 py-2 text-[#eee] ${!sidebarCollapsed ? "mt-4 mb-1" : "my-2"}`}>
                    {!sidebarCollapsed && <span className="text-xs uppercase opacity-50">Інструменти</span>}
                  </div>
                </li>
                <li>
                  <Link
                    href="/admin/calendar"
                    className={`flex items-center px-4 py-2 hover:bg-[#32373c] hover:text-white transition-colors
                      ${isActive("/admin/calendar") ? "bg-[#0073aa] text-white" : ""}`}
                  >
                    <Calendar size={18} className="mr-2" />
                    {!sidebarCollapsed && <span>Календар</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-4 py-2 hover:bg-[#32373c] hover:text-white transition-colors
                      ${isActive("/admin/settings") ? "bg-[#0073aa] text-white" : ""}`}
                  >
                    <Settings size={18} className="mr-2" />
                    {!sidebarCollapsed && <span>Налаштування</span>}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Основний контент */}
        <main
          className={`flex-1 transition-all duration-300 pt-[32px] ${sidebarCollapsed ? "ml-[36px]" : "ml-[160px]"}`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

