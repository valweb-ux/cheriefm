export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { NewsTable } from "@/components/admin/news/news-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function AdminNewsPage() {
  const supabase = createClient()

  // Отримуємо новини з бази даних
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .catch(() => ({ data: [] }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Новини</h1>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="mr-2 h-4 w-4" />
            Додати новину
          </Link>
        </Button>
      </div>

      <NewsTable news={news || []} />
    </div>
  )
}

