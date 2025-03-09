export interface SiteSettings {
  id: string
  created_at: string
  updated_at: string
  site_name: string
  site_description: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
  secondary_color: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  social_links: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    spotify?: string
    [key: string]: string | undefined
  } | null
  footer_text: string | null
  analytics_id: string | null
  meta_keywords: string | null
  default_language: string
  available_languages: string[]
  streaming_enabled: boolean
  streaming_url: string | null
  streaming_format?: string
  streaming_bitrate?: string
  streaming_metadata_url?: string
  maintenance_mode: boolean
  maintenance_message: string | null
}

export type SiteSettingsUpdate = Partial<Omit<SiteSettings, "id" | "created_at">>

// Решта типів залишаються без змін

