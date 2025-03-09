import type React from "react"
import { MusicProvider } from "@/components/music/music-context"

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MusicProvider>
      <main>{children}</main>
    </MusicProvider>
  )
}

