"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { initGA, pageview as gaPageview } from "@/lib/analytics/google-analytics"
import { initFBPixel, pageview as fbPageview } from "@/lib/analytics/facebook-pixel"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Ініціалізація сесії
  useEffect(() => {
    // Перевіряємо, чи є вже sessionId
    let sessionId = localStorage.getItem("sessionId")

    // Якщо немає, створюємо новий
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem("sessionId", sessionId)
    }

    // Ініціалізація аналітичних систем
    initGA()
    initFBPixel()
  }, [])

  // Відстеження зміни сторінки
  useEffect(() => {
    if (!pathname) return

    // Формуємо повний URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Відправляємо дані в Google Analytics
    gaPageview(url)

    // Відправляємо дані в Facebook Pixel
    fbPageview()

    // Відправляємо дані в нашу власну аналітику
    const sessionId = localStorage.getItem("sessionId")

    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pagePath: pathname,
        sessionId,
      }),
    }).catch((error) => {
      console.error("Error sending page view data:", error)
    })
  }, [pathname, searchParams])

  return null
}

