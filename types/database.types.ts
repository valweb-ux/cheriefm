export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          excerpt: string | null
          slug: string
          image_url: string | null
          category_id: string
          is_featured: boolean
          is_published: boolean
          publish_date: string
          author_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          excerpt?: string | null
          slug: string
          image_url?: string | null
          category_id: string
          is_featured?: boolean
          is_published?: boolean
          publish_date: string
          author_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          excerpt?: string | null
          slug?: string
          image_url?: string | null
          category_id?: string
          is_featured?: boolean
          is_published?: boolean
          publish_date?: string
          author_id?: string | null
        }
      }
      news_translations: {
        Row: {
          id: string
          news_id: string
          language: string
          title: string
          content: string
          excerpt: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          news_id: string
          language: string
          title: string
          content: string
          excerpt?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          news_id?: string
          language?: string
          title?: string
          content?: string
          excerpt?: string | null
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      category_translations: {
        Row: {
          id: string
          category_id: string
          language: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          language: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          language?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      news_tags: {
        Row: {
          id: string
          news_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          news_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          news_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      media_files: {
        Row: {
          id: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          width: number | null
          height: number | null
          alt_text: string | null
          description: string | null
          uploaded_by: string
          is_public: boolean
          folder_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          file_path: string
          file_type: string
          file_size: number
          width?: number | null
          height?: number | null
          alt_text?: string | null
          description?: string | null
          uploaded_by: string
          is_public?: boolean
          folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          width?: number | null
          height?: number | null
          alt_text?: string | null
          description?: string | null
          uploaded_by?: string
          is_public?: boolean
          folder_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      languages: {
        Row: {
          code: string
          name: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          code: string
          name: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          name?: string
          is_default?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
      }
      music: {
        Row: {
          id: string
          title: string
          artist_id: string | null
          album: string | null
          release_date: string | null
          duration: number | null
          file_path: string
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id?: string | null
          album?: string | null
          release_date?: string | null
          duration?: number | null
          file_path: string
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string | null
          album?: string | null
          release_date?: string | null
          duration?: number | null
          file_path?: string
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          bio: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      program_translations: {
        Row: {
          id: string
          program_id: string
          language: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          language: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          language?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type NewsItem = Database["public"]["Tables"]["news"]["Row"]
export type NewsInsert = Database["public"]["Tables"]["news"]["Insert"]
export type NewsUpdate = Database["public"]["Tables"]["news"]["Update"]
export type NewsTranslation = Database["public"]["Tables"]["news_translations"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type CategoryTranslation = Database["public"]["Tables"]["category_translations"]["Row"]
export type Tag = Database["public"]["Tables"]["tags"]["Row"]
export type NewsTag = Database["public"]["Tables"]["news_tags"]["Row"]
export type MediaFile = Database["public"]["Tables"]["media_files"]["Row"]
export type MediaFolder = Database["public"]["Tables"]["media_folders"]["Row"]
export type Language = Database["public"]["Tables"]["languages"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Music = Database["public"]["Tables"]["music"]["Row"]
export type Artist = Database["public"]["Tables"]["artists"]["Row"]
export type Program = Database["public"]["Tables"]["programs"]["Row"]
export type ProgramTranslation = Database["public"]["Tables"]["program_translations"]["Row"]

export interface MediaFileWithUrl extends MediaFile {
  url: string
  thumbnail_url?: string
}

