export interface Artist {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  bio_uk: string | null
  bio_fr: string | null
  bio_en: string | null
  image_url: string | null
  country: string | null
  website: string | null
  social_links: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    spotify?: string
    [key: string]: string | undefined
  } | null
  is_featured: boolean
  is_active: boolean
  tags: string[] | null
}

export type ArtistInsert = Omit<Artist, "id" | "created_at" | "updated_at">
export type ArtistUpdate = Partial<Omit<Artist, "id" | "created_at">>

export interface Track {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  artist_id: string | null
  featuring_artists: string[] | null
  album: string | null
  release_date: string | null
  duration: number | null
  audio_url: string | null
  cover_url: string | null
  lyrics_uk: string | null
  lyrics_fr: string | null
  lyrics_en: string | null
  genre: string | null
  is_featured: boolean
  is_active: boolean
  play_count: number
  tags: string[] | null

  // Зв'язки
  artists?: Artist
}

export type TrackInsert = Omit<Track, "id" | "created_at" | "updated_at" | "play_count" | "artists">
export type TrackUpdate = Partial<Omit<Track, "id" | "created_at" | "artists">>

export interface Playlist {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  description_uk: string | null
  description_fr: string | null
  description_en: string | null
  cover_url: string | null
  is_featured: boolean
  is_active: boolean
  tracks: string[] | null
  created_by: string
}

export type PlaylistInsert = Omit<Playlist, "id" | "created_at" | "updated_at">
export type PlaylistUpdate = Partial<Omit<Playlist, "id" | "created_at">>

export interface Chart {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  description_uk: string | null
  description_fr: string | null
  description_en: string | null
  cover_url: string | null
  is_active: boolean
  period_start: string
  period_end: string
  tracks: ChartTrack[]
}

export interface ChartTrack {
  track_id: string
  position: number
  previous_position: number | null
  weeks_on_chart: number
}

export type ChartInsert = Omit<Chart, "id" | "created_at" | "updated_at">
export type ChartUpdate = Partial<Omit<Chart, "id" | "created_at">>

export interface Genre {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  parent_id: string | null
}

export type GenreInsert = Omit<Genre, "id">
export type GenreUpdate = Partial<Omit<Genre, "id">>

