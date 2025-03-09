export interface Program {
  id: string
  created_at: string
  updated_at: string
  title_uk: string
  title_fr: string | null
  title_en: string | null
  description_uk: string
  description_fr: string | null
  description_en: string | null
  host: string | null
  image: string | null
  day_of_week: string
  air_time: string
  duration: number
  is_active: boolean
  is_featured: boolean
  slug_uk: string
  slug_fr: string | null
  slug_en: string | null
  // Нові поля для розширених функцій
  hosts: string[] | null // Масив ID ведучих
  color: string | null // Колір для відображення в календарі
  recurrence_type: "none" | "daily" | "weekly" | "custom" | null
  recurrence_days: number[] | null // Масив днів тижня [0-6]
  recurrence_end_date: string | null
  calendar_sync_enabled: boolean
  calendar_id: string | null
}

export type ProgramInsert = Omit<Program, "id" | "created_at" | "updated_at">
export type ProgramUpdate = Partial<Omit<Program, "id" | "created_at">>

export interface Episode {
  id: string
  created_at: string
  updated_at: string
  program_id: string
  title_uk: string
  title_fr: string | null
  title_en: string | null
  description_uk: string
  description_fr: string | null
  description_en: string | null
  audio_url: string
  image: string | null
  air_date: string
  duration: number
  is_published: boolean
  slug_uk: string
  slug_fr: string | null
  slug_en: string | null
}

export type EpisodeInsert = Omit<Episode, "id" | "created_at" | "updated_at">
export type EpisodeUpdate = Partial<Omit<Episode, "id" | "created_at">>

export interface ScheduleEntry {
  id: string
  program_id: string
  start_time: string // ISO формат дати і часу
  end_time: string // ISO формат дати і часу
  is_recurring: boolean
  recurrence_rule: string | null // iCal RRULE формат
  hosts: string[] | null // Масив ID ведучих для конкретного ефіру
  notes: string | null
  is_special: boolean // Спеціальний випуск
  override_title: string | null // Перевизначення назви для конкретного ефіру
  status: "scheduled" | "live" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export type ScheduleEntryInsert = Omit<ScheduleEntry, "id" | "created_at" | "updated_at">
export type ScheduleEntryUpdate = Partial<Omit<ScheduleEntry, "id" | "created_at">>

export interface Host {
  id: string
  name: string
  bio: string | null
  photo: string | null
  email: string | null
  phone: string | null
  social_media: {
    instagram?: string
    twitter?: string
    facebook?: string
    linkedin?: string
  } | null
  is_active: boolean
  programs: string[] | null // Масив ID програм
  created_at: string
  updated_at: string
}

export type HostInsert = Omit<Host, "id" | "created_at" | "updated_at">
export type HostUpdate = Partial<Omit<Host, "id" | "created_at">>

