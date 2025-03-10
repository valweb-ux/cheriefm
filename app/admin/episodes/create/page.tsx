export const dynamic = "force-dynamic"

import { EpisodeForm } from "@/components/admin/episodes/episode-form"
import { createClient } from "@/lib/supabase/server"

export default async function CreateEpisodePage() {
  const supabase = createClient()

  // Отримуємо програми з бази даних
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("title")
    .catch(() => ({ data: [] }))

  // Отримуємо мови з бази даних
  const { data: languages } = await supabase
    .from("languages")
    .select("*")
    .order("name")
    .catch(() => ({ data: [] }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Створити епізод</h1>
      <EpisodeForm programs={programs || []} languages={languages || []} />
    </div>
  )
}

