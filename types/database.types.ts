export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      episodes: {
        Row: {
          id: string
          title: string
          description: string | null
          program_id: string | null
          image_url: string | null
          audio_url: string
          published_at: string | null
          published: boolean | null
          language_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          program_id?: string | null
          image_url?: string | null
          audio_url: string
          published_at?: string | null
          published?: boolean | null
          language_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          program_id?: string | null
          image_url?: string | null
          audio_url?: string
          published_at?: string | null
          published?: boolean | null
          language_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          meta_title: string | null
          meta_description: string | null
          featured_image: string | null
          published: boolean | null
          language_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          featured_image?: string | null
          published?: boolean | null
          language_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          featured_image?: string | null
          published?: boolean | null
          language_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      radio_info: {
        Row: {
          id: string
          title: string
          description: string | null
          stream_url: string
          logo: string | null
          current_track: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string
          description?: string | null
          stream_url?: string
          logo?: string | null
          current_track?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          stream_url?: string
          logo?: string | null
          current_track?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string | null
          host: string | null
          duration: number | null
          image: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          host?: string | null
          duration?: number | null
          image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          host?: string | null
          duration?: number | null
          image?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      languages: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string | null
        }
      }
      radio_shows: {
        Row: {
          id: string
          title: string
          description: string | null
          host: string | null
          duration: number | null
          image: string | null
          schedule: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          host?: string | null
          duration?: number | null
          image?: string | null
          schedule?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          host?: string | null
          duration?: number | null
          image?: string | null
          schedule?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      news: {
        Row: {
          id: string
          title: string
          excerpt: string | null
          content: string | null
          image: string | null
          category: string | null
          published: boolean | null
          published_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          excerpt?: string | null
          content?: string | null
          image?: string | null
          category?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          image?: string | null
          category?: string | null
          published?: boolean | null
          published_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          artist_name: string
          album: string | null
          duration: number
          image_url: string | null
          audio_url: string
          plays: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          artist_name: string
          album?: string | null
          duration: number
          image_url?: string | null
          audio_url: string
          plays?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          artist_name?: string
          album?: string | null
          duration?: number
          image_url?: string | null
          audio_url?: string
          plays?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          slug: string | null
          image_url: string | null
          genre: string | null
          bio: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          image_url?: string | null
          genre?: string | null
          bio?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          image_url?: string | null
          genre?: string | null
          bio?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      playlists: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          tracks_count: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          tracks_count?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          tracks_count?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      playlist_tracks: {
        Row: {
          id: string
          playlist_id: string
          track_id: string
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          track_id: string
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          track_id?: string
          position?: number | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

