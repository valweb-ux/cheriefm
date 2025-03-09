export const dynamic = "force-dynamic"

import { EpisodeForm } from "@/components/admin/episodes/episode-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditEpisodePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Отримуємо епізод з бази даних
  const { data: episode } = await supabase.from("episodes").select("*").eq("id", params.id).single()

  // Отримуємо програми з бази даних
  const { data: programs } = await supabase.from("programs").select("*").order("title")

  // Отримуємо мови з бази даних
  const { data: languages } = await supabase.from("languages").select("*").order("name")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Редагувати епізод</h1>
      <EpisodeForm episode={episode} programs={programs || []} languages={languages || []} />
    </div>
  )
}

