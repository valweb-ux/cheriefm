import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.from("site_settings").select("*").single()

    if (error) {
      console.error("Помилка при отриманні налаштувань:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Неочікувана помилка при отриманні налаштувань:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося отримати налаштування" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .upsert([{ id: 1, ...settings }], { onConflict: "id" })
      .select()
      .single()

    if (error) {
      console.error("Помилка при збереженні налаштувань:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Неочікувана помилка при збереженні налаштувань:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося зберегти налаштування" },
      { status: 500 },
    )
  }
}

