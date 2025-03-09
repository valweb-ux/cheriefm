export interface RadioTrackInfo {
  title: string
  artist: string
  album?: string
  coverUrl?: string
  startedAt: string
  duration?: number
}

export interface RadioSchedule {
  id: string
  title: string
  description?: string
  startTime: string // формат "HH:MM"
  endTime: string // формат "HH:MM"
  days: number[] // 0-6, де 0 - неділя, 6 - субота
  hostName?: string
  showId?: string
  imageUrl?: string
}

export interface RadioShow {
  id: string
  title: string
  description: string
  hostName: string
  imageUrl?: string
  schedules?: RadioSchedule[]
}

export interface RadioAdvert {
  id: string
  title: string
  audioUrl: string
  duration: number
  isActive: boolean
  priority: number
  startDate?: string
  endDate?: string
  playCount: number
  maxImpressions?: number
  frequency?: "always" | "once_per_session" | "once_per_day" | "custom"
  customFrequency?: number // в хвилинах
  lastUpdated: string
  // Нові поля для таргетування
  targeting?: AdvertTargeting
}

export interface RadioAdvertSettings {
  enabled: boolean
  playBeforeStream: boolean
  rotateAdverts: boolean
  skipEnabled: boolean
  skipAfterSeconds: number
  sessionTimeout: number // в хвилинах
}

// Нові типи для таргетування реклами
export interface AdvertTargeting {
  devices?: string[] // "desktop", "mobile", "tablet"
  browsers?: string[] // "chrome", "firefox", "safari", etc.
  countries?: string[] // коди країн "UA", "US", etc.
  regions?: string[] // регіони або області
  cities?: string[] // міста
  languages?: string[] // мови "uk", "en", "fr"
  timeOfDay?: TimeOfDayTargeting[] // час доби
  daysOfWeek?: number[] // 0-6, де 0 - неділя, 6 - субота
  userGroups?: string[] // групи користувачів "registered", "premium", etc.
  ageGroups?: string[] // вікові групи "18-24", "25-34", etc.
  gender?: string[] // "male", "female", "other"
  interests?: string[] // інтереси користувачів
  programs?: string[] // ID програм, під час яких показувати рекламу
}

export interface TimeOfDayTargeting {
  startTime: string // формат "HH:MM"
  endTime: string // формат "HH:MM"
}

// Тип для даних про користувача для таргетування
export interface UserTargetingData {
  deviceType?: "desktop" | "mobile" | "tablet" | "unknown"
  browser?: string
  country?: string
  region?: string
  city?: string
  language?: string
  timeOfDay?: string // поточний час у форматі "HH:MM"
  dayOfWeek?: number // 0-6
  userGroup?: string
  ageGroup?: string
  gender?: string
  interests?: string[]
  listeningProgram?: string // ID програми, яку слухає користувач
}

