import type React from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import "@/styles/admin-panel.css"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

