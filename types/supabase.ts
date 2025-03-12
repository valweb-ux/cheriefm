export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: number
          title: string
          content: string
          created_at: string
          publish_date?: string
          image_url?: string
        }
        Insert: {
          title: string
          content: string
          publish_date?: string
          image_url?: string
        }
        Update: {
          title?: string
          content?: string
          publish_date?: string
          image_url?: string
        }
      }
    }
  }
}

// Додаємо цей інтерфейс після існуючих типів

export interface News {
  id: number
  title: string
  content: string
  created_at: string
  publish_date?: string
  image_url?: string
}

