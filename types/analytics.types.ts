export interface PageView {
  id: string
  page_path: string
  referrer: string | null
  user_agent: string | null
  ip_address: string | null
  created_at: string
  session_id: string | null
  country: string | null
  city: string | null
  device_type: "desktop" | "mobile" | "tablet" | "unknown"
  browser: string | null
}

export interface TrackPlay {
  id: string
  track_id: string
  user_id: string | null
  session_id: string | null
  play_duration: number
  created_at: string
  completed: boolean
  ip_address: string | null
  device_type: "desktop" | "mobile" | "tablet" | "unknown"
}

export interface RadioListening {
  id: string
  program_id: string | null
  user_id: string | null
  session_id: string | null
  listen_duration: number
  created_at: string
  ip_address: string | null
  device_type: "desktop" | "mobile" | "tablet" | "unknown"
}

export interface AnalyticsDashboardData {
  totalPageViews: number
  uniqueVisitors: number
  trackPlays: number
  radioListeningTime: number
  pageViewsByDay: {
    date: string
    count: number
  }[]
  topTracks: {
    id: string
    title: string
    artist: string
    plays: number
  }[]
  topPages: {
    path: string
    views: number
  }[]
  deviceDistribution: {
    device: string
    count: number
  }[]
  countryDistribution: {
    country: string
    count: number
  }[]
}

export interface SeoSettings {
  id: string
  created_at: string
  updated_at: string
  site_title_template: string
  site_description: string
  default_og_image: string | null
  twitter_handle: string | null
  twitter_card_type: "summary" | "summary_large_image" | "app" | "player"
  facebook_app_id: string | null
  enable_sitemap: boolean
  enable_robots_txt: boolean
  enable_structured_data: boolean
  enable_canonical_urls: boolean
  google_site_verification: string | null
  bing_site_verification: string | null
  yandex_verification: string | null
  custom_meta_tags: Record<string, string> | null
}

export type SeoSettingsUpdate = Partial<Omit<SeoSettings, "id" | "created_at">>

export interface PageSeoData {
  id: string
  page_id: string | null
  page_type: "home" | "news" | "music" | "radio" | "page" | "artist" | "track" | "playlist"
  page_path: string | null
  title: string | null
  description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  canonical_url: string | null
  no_index: boolean
  no_follow: boolean
  created_at: string
  updated_at: string
}

export type PageSeoDataUpdate = Partial<Omit<PageSeoData, "id" | "created_at">>

