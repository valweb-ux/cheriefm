import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSeoSettings } from "@/lib/services/analytics-service"

export async function GET(request: NextRequest) {
  try {
    const seoSettings = await getSeoSettings()

    // Перевіряємо, чи увімкнена генерація sitemap
    if (!seoSettings.enable_sitemap) {
      return NextResponse.json({ error: "Sitemap generation is disabled" }, { status: 404 })
    }

    const supabase = createClient()

    // Отримуємо всі URL для sitemap
    const urls = []

    // Додаємо головну сторінку
    urls.push({
      loc: process.env.NEXT_PUBLIC_SITE_URL || "https://cheriefm.ua",
      lastmod: new Date().toISOString(),
      priority: 1.0,
      changefreq: "daily",
    })

    // Отримуємо новини
    const { data: news } = await supabase
      .from("news")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })

    if (news) {
      news.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.8,
          changefreq: "weekly",
        })
      })
    }

    // Отримуємо музику
    const { data: tracks } = await supabase
      .from("music")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false })

    if (tracks) {
      tracks.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/music/tracks/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.7,
          changefreq: "monthly",
        })
      })
    }

    // Отримуємо виконавців
    const { data: artists } = await supabase
      .from("artists")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false })

    if (artists) {
      artists.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/music/artists/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.7,
          changefreq: "monthly",
        })
      })
    }

    // Отримуємо плейлисти
    const { data: playlists } = await supabase
      .from("playlists")
      .select("slug, updated_at")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })

    if (playlists) {
      playlists.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/music/playlists/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.6,
          changefreq: "weekly",
        })
      })
    }

    // Отримуємо програми
    const { data: programs } = await supabase
      .from("programs")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false })

    if (programs) {
      programs.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/radio/shows/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.7,
          changefreq: "weekly",
        })
      })
    }

    // Отримуємо сторінки
    const { data: pages } = await supabase
      .from("pages")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })

    if (pages) {
      pages.forEach((item) => {
        urls.push({
          loc: `${process.env.NEXT_PUBLIC_SITE_URL}/pages/${item.slug}`,
          lastmod: item.updated_at,
          priority: 0.5,
          changefreq: "monthly",
        })
      })
    }

    // Генеруємо XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
  `,
    )
    .join("")}
</urlset>`

    // Повертаємо XML
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

