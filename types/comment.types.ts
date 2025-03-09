export interface Comment {
  id: string
  newsId: string
  authorName: string
  authorEmail: string
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  parentId?: string
  replyToId?: string
  ipAddress?: string
  userAgent?: string
}

