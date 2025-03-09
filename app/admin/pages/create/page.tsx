export const dynamic = "force-dynamic"

import { PageForm } from "@/components/admin/pages/page-form"
import { createClient } from "@/lib/supabase/server"

export default async function CreatePagePage() {
  const supabase = createClient()

  // Отримуємо мови з бази даних
  const { data: languages } = await supabase.from("languages").select("*").order("name")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Створити сторінку</h1>
      <PageForm languages={languages || []} />
    </div>
  )
}

