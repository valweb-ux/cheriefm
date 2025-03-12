import type React from "react"
import { NavMenu } from "./nav-menu"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavMenu />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto text-center">
          © {new Date().getFullYear()} Ваш Сайт Новин. Всі права захищені.
        </div>
      </footer>
    </div>
  )
}

