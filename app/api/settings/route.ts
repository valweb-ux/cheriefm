import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // First check if the table exists
    const { error: checkError } = await supabaseAdmin.from("site_settings").select("count").limit(1)

    if (checkError) {
      // Table doesn't exist yet, return default settings
      console.log("Settings table doesn't exist yet, returning defaults")
      return NextResponse.json({
        site_title: "CherieFM",
        site_tagline: "Feel Good Music !",
        site_icon_url: "/placeholder.svg",
        site_url: "",
        admin_email: "",
        allow_registration: false,
        default_role: "user",
        site_language: "uk",
        timezone: "UTC+2",
        date_format: "d MMMM yyyy",
        time_format: "HH:mm",
        week_starts_on: "monday",
      })
    }

    const { data, error } = await supabaseAdmin.from("site_settings").select("*").single()

    if (error) {
      console.error("Помилка при отриманні налаштувань:", error)

      // If no record found, return default settings
      if (error.code === "PGRST116") {
        return NextResponse.json({
          site_title: "CherieFM",
          site_tagline: "Feel Good Music !",
          site_icon_url: "/placeholder.svg",
          site_url: "",
          admin_email: "",
          allow_registration: false,
          default_role: "user",
          site_language: "uk",
          timezone: "UTC+2",
          date_format: "d MMMM yyyy",
          time_format: "HH:mm",
          week_starts_on: "monday",
        })
      }

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

    // Check if the table exists first
    const { error: checkError } = await supabaseAdmin.from("site_settings").select("count").limit(1)

    if (checkError) {
      // Table doesn't exist, create it first
      console.log("Creating site_settings table before saving...")
      await fetch("/api/setup-settings-table", { method: "GET" })
    }

    // Now try to save the settings
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .upsert([{ id: 1, ...settings }], { onConflict: "id" })
      .select()

    if (error) {
      console.error("Помилка при збереженні налаштувань:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0] || {})
  } catch (error) {
    console.error("Неочікувана помилка при збереженні налаштувань:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося зберегти налаштування" },
      { status: 500 },
    )
  }
}

