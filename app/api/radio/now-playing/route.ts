import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  // Отримуємо поточний трек з бази даних
  const { data, error } = await supabase
    .from("current_tracks")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

