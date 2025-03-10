import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  // Отримуємо поточний трек з бази даних
  const { data, error } = await supabase
    .from("radio_info")
    .select("*")
    .single()
    .catch(() => ({ data: null, error: { message: "Помилка при отриманні інформації про радіо" } }))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || { current_track: "Зараз грає музика" })
}

