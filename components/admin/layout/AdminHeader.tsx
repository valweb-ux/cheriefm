"use client"

import Link from "next/link"
import { Menu, Bell, User, LogOut } from "lucide-react"
import { useState } from "react"

interface AdminHeaderProps {
  toggleSidebar: () => void
}

export function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <Link href="/admin" className="ml-4 text-lg font-medium text-gray-800">
            CherieFM Адмінпанель
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="hidden md:inline">Адміністратор</span>
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
  )
}

