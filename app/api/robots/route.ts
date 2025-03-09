import { type NextRequest, NextResponse } from "next/server"
import { getSeoSettings } from "@/lib/services/analytics-service"

export async function GET(request: NextRequest) {
  try {
    const seoSettings = await getSeoSettings()

    // Перевіряємо, чи увімкнена генерація robots.txt
    if (!seoSettings.enable_robots_txt) {
      return NextResponse.json({ error: "Robots.txt generation is disabled" }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cheriefm.ua"

    // Генеруємо robots.txt
    const robotsTxt = `# robots.txt for ${siteUrl}
User-agent: *
${seoSettings.enable_sitemap ? `Sitemap: ${siteUrl}/sitemap.xml` : ""}

# Дозволені шляхи
Allow: /
Allow: /news/
Allow: /music/
Allow: /radio/
Allow: /pages/

# Заборонені шляхи
Disallow: /admin/
Disallow: /api/
`

    // Повертаємо robots.txt
    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating robots.txt:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

