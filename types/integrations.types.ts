// Типи для соціальних мереж
export interface SocialMediaPost {
  content: string
  imageUrl?: string
  link?: string
  scheduledFor?: Date
  platforms: SocialPlatform[]
  status: "draft" | "scheduled" | "published" | "failed"
  errorMessage?: string
  postIds?: Record<string, string> // ID постів на різних платформах
}

export type SocialPlatform = "facebook" | "twitter" | "instagram" | "linkedin"

export interface SocialMediaAccount {
  id: string
  platform: SocialPlatform
  name: string
  profileId: string
  accessToken: string
  refreshToken?: string
  tokenExpiry?: Date
  isConnected: boolean
  lastChecked?: Date
}

// Типи для сервісів розсилок
export interface Newsletter {
  id: string
  name: string
  description?: string
  subscriberCount: number
  createdAt: Date
  updatedAt: Date
  lastSentAt?: Date
  service: "mailchimp" | "sendgrid" | "internal"
  serviceListId?: string
  settings?: Record<string, any>
}

export interface NewsletterTemplate {
  id: string
  name: string
  subject: string
  content: string
  createdAt: Date
  updatedAt: Date
  previewImageUrl?: string
}

export interface NewsletterCampaign {
  id: string
  newsletterId: string
  templateId: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed"
  scheduledFor?: Date
  sentAt?: Date
  openRate?: number
  clickRate?: number
  recipientCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Subscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  preferences?: {
    music?: boolean
    news?: boolean
    events?: boolean
    promotions?: boolean
  }
  newsletterIds: string[]
  metadata?: Record<string, any>
}

// Типи для API мобільних додатків
export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  expiresAt?: Date
  lastUsed?: Date
  permissions: ApiPermission[]
  ipRestrictions?: string[]
  isActive: boolean
}

export type ApiPermission =
  | "read:music"
  | "write:music"
  | "read:news"
  | "write:news"
  | "read:radio"
  | "write:radio"
  | "read:user"
  | "write:user"
  | "admin"

export interface ApiUsageStats {
  apiKeyId: string
  endpoint: string
  method: string
  timestamp: Date
  responseTime: number
  statusCode: number
  ipAddress: string
  userAgent?: string
}

export interface ApiRateLimit {
  apiKeyId: string
  limit: number
  window: number // в секундах
  currentUsage: number
  resetAt: Date
}

