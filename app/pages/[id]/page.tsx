export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageParams {
  params: { id: string }
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const supabase = createClient()

  try {
    // Отримуємо сторінку з бази даних
    const { data: page } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", params.id)
      .single()
      .catch(() => ({ data: null }))

    if (!page) {
      return {
        title: "Сторінка не знайдена",
      }
    }

    return {
      title: page.meta_title || page.title,
      description: page.meta_description || page.content?.substring(0, 160),
    }
  } catch (error) {
    console.error(`Error generating metadata for page ${params.id}:`, error)
    return {
      title: "Chérie FM",
    }
  }
}

export default async function PageDetailPage({ params }: PageParams) {
  const supabase = createClient()

  try {
    // Отримуємо сторінку з бази даних
    const { data: page, error } = await supabase.from("pages").select("*").eq("slug", params.id).single()

    if (error || !page) {
      console.error(`Error fetching page with slug ${params.id}:`, error)
      notFound()
    }

    return (
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

        {page.featured_image && (
          <div className="mb-6">
            <img
              src={page.featured_image || "/placeholder.svg"}
              alt={page.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content || "" }} />
      </main>
    )
  } catch (error) {
    console.error(`Unexpected error in page ${params.id}:`, error)
    throw error // Це викличе відображення компонента error.tsx
  }
}

