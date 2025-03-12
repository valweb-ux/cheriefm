import type React from "react"
import "../styles/globals.css"
import "../app/globals.css"
import { NavMenu } from "@/components/nav-menu"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        <div className="min-h-screen bg-background flex flex-col">
          <NavMenu />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto text-center">
              © {new Date().getFullYear()} CherieFM. Всі права захищені.
            </div>
          </footer>
        </div>
        {/* RadioPlayer component removed */}
      </body>
    </html>
  )
}

