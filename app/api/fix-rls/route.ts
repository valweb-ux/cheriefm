import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Початок виправлення RLS...")

    // Вимикаємо RLS для таблиці news
    const supabaseAdmin = getSupabaseAdmin()
    const { error: disableNewsRlsError } = await supabaseAdmin.rpc("disable_rls", { table_name: "news" })

    if (disableNewsRlsError) {
      console.error("Помилка при вимкненні RLS для таблиці news:", disableNewsRlsError)
      return NextResponse.json({ error: disableNewsRlsError.message }, { status: 500 })
    }

    // Створюємо політику для таблиці news
    const { error: createNewsPolicyError } = await supabaseAdmin.rpc("create_public_policy", {
      table_name: "news",
      policy_name: "Allow all operations for public",
      operation: "ALL",
    })

    if (createNewsPolicyError) {
      console.error("Помилка при створенні політики для таблиці news:", createNewsPolicyError)
      return NextResponse.json({ error: createNewsPolicyError.message }, { status: 500 })
    }

    // Вмикаємо RLS для таблиці news
    const { error: enableNewsRlsError } = await supabaseAdmin.rpc("enable_rls", { table_name: "news" })

    if (enableNewsRlsError) {
      console.error("Помилка при вмиканні RLS для таблиці news:", enableNewsRlsError)
      return NextResponse.json({ error: enableNewsRlsError.message }, { status: 500 })
    }

    // Налаштовуємо публічний доступ до bucket images
    const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket("images", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    })

    if (updateBucketError) {
      console.error("Помилка при оновленні налаштувань bucket images:", updateBucketError)
      return NextResponse.json({ error: updateBucketError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "RLS успішно виправлено",
      instructions: "Тепер ви можете додавати новини та завантажувати зображення",
    })
  } catch (error) {
    console.error("Неочікувана помилка при виправленні RLS:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

