import type React from "react"
import "../styles/globals.css"
import "../app/globals.css"
import { NavMenu } from "@/components/nav-menu"
import { RadioPlayer } from "./components/radio-player"
import { supabase } from "@/lib/supabase"
import type { RadioStation } from "./types"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Отримуємо список радіостанцій
  const { data: stations } = await supabase.from("radio_stations").select("*").order("name")

  return (
    <html lang="uk">
      <body>
        <div className="min-h-screen bg-background flex flex-col">
          <NavMenu />
          <main className="flex-grow container mx-auto px-4 py-8 pb-24">{children}</main>
          <footer className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto text-center">
              © {new Date().getFullYear()} CherieFM. Всі права захищені.
            </div>
          </footer>

          {/* Закріплений радіоплеєр внизу сторінки */}
          <RadioPlayer stations={(stations as RadioStation[]) || []} />
        </div>
      </body>
    </html>
  )
}

