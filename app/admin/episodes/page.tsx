export const dynamic = "force-dynamic"

import { EpisodesTable } from "@/components/admin/episodes/episodes-table"
import { createClient } from "@/lib/supabase/server"

export default async function EpisodesPage() {
  const supabase = createClient()

  // Отримуємо епізоди з бази даних
  const { data: episodes } = await supabase.from("episodes").select("*").order("published_at", { ascending: false })

  // Отримуємо програми з бази даних
  const { data: programs } = await supabase.from("programs").select("*")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Епізоди</h1>
      <EpisodesTable episodes={episodes || []} programs={programs || []} />
    </div>
  )
}

