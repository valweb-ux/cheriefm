export const dynamic = "force-dynamic"

import { PagesTable } from "@/components/admin/pages/pages-table"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function PagesPage() {
  const supabase = createClient()

  // Отримуємо сторінки з бази даних
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("title")
    .catch(() => ({ data: [] }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Сторінки</h1>
        <Button asChild>
          <Link href="/admin/pages/create">
            <Plus className="mr-2 h-4 w-4" />
            Додати сторінку
          </Link>
        </Button>
      </div>

      <PagesTable
        pages={pages || []}
        onEdit={(id) => `/admin/pages/edit/${id}`}
        onDelete={(id) => {
          // Функція для видалення сторінки
        }}
      />
    </div>
  )
}

