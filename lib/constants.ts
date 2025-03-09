// Мовні константи
export const LANGUAGES = {
  UKRAINIAN: "uk",
  FRENCH: "fr",
  ENGLISH: "en",
} as const

export type LanguageCode = keyof typeof LANGUAGES

// Типи пристроїв
export const DEVICE_TYPES = {
  DESKTOP: "desktop",
  MOBILE: "mobile",
  TABLET: "tablet",
  UNKNOWN: "unknown",
} as const

export type DeviceType = keyof typeof DEVICE_TYPES

// Браузери
export const BROWSERS = {
  CHROME: "chrome",
  FIREFOX: "firefox",
  SAFARI: "safari",
  EDGE: "edge",
  OPERA: "opera",
  IE: "ie",
  UNKNOWN: "unknown",
} as const

export type BrowserType = keyof typeof BROWSERS

// Статуси публікації
export const PUBLICATION_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
} as const

// Типи контенту
export const CONTENT_TYPES = {
  NEWS: "news",
  MUSIC: "music",
  PROGRAM: "program",
  PAGE: "page",
  ARTIST: "artist",
  TRACK: "track",
  PLAYLIST: "playlist",
  CHART: "chart",
} as const

// Дні тижня
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

// Формати дати
export const DATE_FORMATS = {
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE: "yyyy-MM-dd",
  TIME: "HH:mm",
  DATETIME: "yyyy-MM-dd HH:mm",
  DISPLAY_DATE: "dd.MM.yyyy",
  DISPLAY_TIME: "HH:mm",
  DISPLAY_DATETIME: "dd.MM.yyyy HH:mm",
} as const

// API шляхи
export const API_PATHS = {
  NEWS: "/api/admin/news",
  PROGRAMS: "/api/admin/programs",
  EPISODES: "/api/admin/episodes",
  PAGES: "/api/admin/pages",
  MEDIA: "/api/admin/media",
  ARTISTS: "/api/admin/music/artists",
  TRACKS: "/api/admin/music/tracks",
  PLAYLISTS: "/api/admin/music/playlists",
  CHARTS: "/api/admin/music/charts",
  HOSTS: "/api/admin/hosts",
  SCHEDULE: "/api/admin/schedule",
  SCHEDULE_TEMPLATES: "/api/admin/schedule/templates",
  SCHEDULE_DAY: "/api/admin/schedule/day",
  ANALYTICS: "/api/analytics",
  SETTINGS: "/api/admin/settings",
} as const

// Повідомлення про помилки
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Ви не авторизовані",
  NOT_FOUND: "Ресурс не знайдено",
  SERVER_ERROR: "Помилка сервера",
  VALIDATION_ERROR: "Помилка валідації",
  REQUIRED_FIELDS: "Заповніть всі обов'язкові поля",
  FETCH_ERROR: "Помилка при отриманні даних",
  CREATE_ERROR: "Помилка при створенні",
  UPDATE_ERROR: "Помилка при оновленні",
  DELETE_ERROR: "Помилка при видаленні",
} as const

// Повідомлення про успіх
export const SUCCESS_MESSAGES = {
  CREATED: "Успішно створено",
  UPDATED: "Успішно оновлено",
  DELETED: "Успішно видалено",
  SAVED: "Успішно збережено",
} as const

