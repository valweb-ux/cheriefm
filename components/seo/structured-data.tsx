import Script from "next/script"
import { getSeoSettings } from "@/lib/services/analytics-service"

interface StructuredDataProps {
  type: "website" | "article" | "music" | "radio" | "person" | "organization"
  data: Record<string, any>
}

export async function StructuredData({ type, data }: StructuredDataProps) {
  const seoSettings = await getSeoSettings()

  // Перевіряємо, чи увімкнені структуровані дані
  if (!seoSettings.enable_structured_data) {
    return null
  }

  let structuredData: Record<string, any> = {}

  switch (type) {
    case "website":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: data.name || "Chérie FM",
        url: data.url || process.env.NEXT_PUBLIC_SITE_URL,
        description: data.description || seoSettings.site_description,
        publisher: {
          "@type": "Organization",
          name: "Chérie FM",
          logo: {
            "@type": "ImageObject",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
          },
        },
      }
      break

    case "article":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          "@type": "Person",
          name: data.author || "Chérie FM",
        },
        publisher: {
          "@type": "Organization",
          name: "Chérie FM",
          logo: {
            "@type": "ImageObject",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
      }
      break

    case "music":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        name: data.title,
        byArtist: {
          "@type": "MusicGroup",
          name: data.artist,
        },
        inAlbum: data.album
          ? {
              "@type": "MusicAlbum",
              name: data.album,
            }
          : undefined,
        duration: data.duration,
        url: data.url,
      }
      break

    case "radio":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "RadioSeries",
        name: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        director: data.host
          ? {
              "@type": "Person",
              name: data.host,
            }
          : undefined,
        url: data.url,
      }
      break

    case "person":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.name,
        description: data.description,
        image: data.image,
        url: data.url,
      }
      break

    case "organization":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: data.name || "Chérie FM",
        description: data.description || seoSettings.site_description,
        url: data.url || process.env.NEXT_PUBLIC_SITE_URL,
        logo: data.logo || `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        sameAs: [
          seoSettings.social_links?.facebook,
          seoSettings.social_links?.instagram,
          seoSettings.social_links?.twitter,
          seoSettings.social_links?.youtube,
        ].filter(Boolean),
      }
      break
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

