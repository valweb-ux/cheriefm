export const dynamic = "force-dynamic"

import { PageForm } from "@/components/admin/pages/page-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Отримуємо сторінку з бази даних
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", params.id)
    .single()
    .catch(() => ({ data: null }))

  // Отримуємо мови з бази даних
  const { data: languages } = await supabase
    .from("languages")
    .select("*")
    .order("name")
    .catch(() => ({ data: [] }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Редагувати сторінку</h1>
      <PageForm page={page} languages={languages || []} />
    </div>
  )
}

