export const dynamic = "force-dynamic"

import { NewsForm } from "@/components/admin/news/news-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditNewsPage({ params }: { params: { newsId: string } }) {
  const supabase = createClient()

  // Отримуємо новину з бази даних
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("id", params.newsId)
    .single()
    .catch(() => ({ data: null }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Редагувати новину</h1>
      <NewsForm news={news} />
    </div>
  )
}

