import { getSeoSettings, getPageSeoData } from "@/lib/services/analytics-service"

interface MetaTagsProps {
  pageType: string
  pagePath?: string
  title?: string
  description?: string
  image?: string
  url?: string
  keywords?: string
  noIndex?: boolean
  noFollow?: boolean
}

export async function MetaTags({
  pageType,
  pagePath,
  title,
  description,
  image,
  url,
  keywords,
  noIndex,
  noFollow,
}: MetaTagsProps) {
  // Отримуємо загальні SEO налаштування
  const seoSettings = await getSeoSettings()

  // Отримуємо SEO дані для конкретної сторінки, якщо вони є
  const pageSeoData = await getPageSeoData(pageType, pagePath)

  // Визначаємо фінальні значення, з пріоритетом для props, потім pageSeoData, потім seoSettings
  const finalTitle = title || pageSeoData?.title || seoSettings.site_title_template.replace("%s", pageType)
  const finalDescription = description || pageSeoData?.description || seoSettings.site_description
  const finalImage = image || pageSeoData?.og_image || seoSettings.default_og_image
  const finalUrl =
    url || (pagePath ? `${process.env.NEXT_PUBLIC_SITE_URL}${pagePath}` : process.env.NEXT_PUBLIC_SITE_URL)
  const finalKeywords = keywords || pageSeoData?.keywords || seoSettings.custom_meta_tags?.keywords

  // Визначаємо, чи потрібно індексувати сторінку
  const shouldIndex = !(noIndex || pageSeoData?.no_index)
  const shouldFollow = !(noFollow || pageSeoData?.no_follow)

  // Формуємо robots значення
  const robotsContent = [shouldIndex ? "index" : "noindex", shouldFollow ? "follow" : "nofollow"].join(", ")

  return (
    <>
      {/* Базові мета-теги */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription || ""} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Канонічний URL */}
      {seoSettings.enable_canonical_urls && <link rel="canonical" href={pageSeoData?.canonical_url || finalUrl} />}

      {/* Open Graph мета-теги */}
      <meta property="og:title" content={pageSeoData?.og_title || finalTitle} />
      <meta property="og:description" content={pageSeoData?.og_description || finalDescription || ""} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content="website" />
      {finalImage && <meta property="og:image" content={finalImage} />}
      {seoSettings.facebook_app_id && <meta property="fb:app_id" content={seoSettings.facebook_app_id} />}

      {/* Twitter мета-теги */}
      <meta name="twitter:card" content={seoSettings.twitter_card_type} />
      {seoSettings.twitter_handle && <meta name="twitter:site" content={seoSettings.twitter_handle} />}
      <meta name="twitter:title" content={pageSeoData?.twitter_title || finalTitle} />
      <meta name="twitter:description" content={pageSeoData?.twitter_description || finalDescription || ""} />
      {finalImage && <meta name="twitter:image" content={pageSeoData?.twitter_image || finalImage} />}

      {/* Верифікація сайту */}
      {seoSettings.google_site_verification && (
        <meta name="google-site-verification" content={seoSettings.google_site_verification} />
      )}
      {seoSettings.bing_site_verification && <meta name="msvalidate.01" content={seoSettings.bing_site_verification} />}
      {seoSettings.yandex_verification && <meta name="yandex-verification" content={seoSettings.yandex_verification} />}

      {/* Додаткові мета-теги */}
      {seoSettings.custom_meta_tags &&
        Object.entries(seoSettings.custom_meta_tags).map(
          ([name, content]) => name !== "keywords" && <meta key={name} name={name} content={content} />,
        )}
    </>
  )
}

