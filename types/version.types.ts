import type { News } from "./news.types"

export interface Version {
  id: string
  newsId: string
  data: Partial<News>
  changes: Record<string, boolean>
  createdAt: Date
  createdBy?: string
}

