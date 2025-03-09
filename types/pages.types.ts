export interface Page {
  id: string
  created_at: string
  updated_at: string
  title_uk: string
  title_fr: string | null
  title_en: string | null
  content_uk: string
  content_fr: string | null
  content_en: string | null
  slug_uk: string
  slug_fr: string | null
  slug_en: string | null
  meta_description_uk: string | null
  meta_description_fr: string | null
  meta_description_en: string | null
  is_published: boolean
  in_menu: boolean
  menu_order: number | null
  parent_id: string | null
}

export type PageInsert = Omit<Page, "id" | "created_at" | "updated_at">
export type PageUpdate = Partial<Omit<Page, "id" | "created_at">>

