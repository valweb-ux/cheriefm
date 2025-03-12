"use client"

import type React from "react"
import { TopBar } from "./TopBar"
import { Sidebar } from "./Sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-panel">
      <TopBar />
      <div className="admin-content">
        <Sidebar />
        <div className="admin-main">{children}</div>
      </div>
    </div>
  )
}

