// Додаємо типи для медіафайлів до існуючого файлу схеми

export interface MediaFile {
  id: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  width?: number
  height?: number
  alt_text?: string
  description?: string
  uploaded_by: string
  created_at: string
  updated_at: string
  is_public: boolean
  folder_id?: string
}

export interface MediaFolder {
  id: string
  name: string
  parent_id?: string
  created_at: string
  updated_at: string
  created_by: string
}

export type MediaFileWithUrl = MediaFile & {
  url: string
  thumbnail_url?: string
}

