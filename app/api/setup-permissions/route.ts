import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Початок налаштування дозволів...")

    // Крок 1: Налаштування RLS для таблиці news
    console.log("Крок 1: Налаштування RLS для таблиці news...")

    const supabaseAdmin = getSupabaseAdmin()

    // Вимикаємо RLS для таблиці news
    const { error: disableRlsError } = await supabaseAdmin.rpc("disable_rls", { table_name: "news" })

    if (disableRlsError) {
      console.error("Помилка при вимкненні RLS для таблиці news:", disableRlsError)
      return NextResponse.json({ error: disableRlsError.message }, { status: 500 })
    }

    // Створюємо політику для таблиці news
    const { error: createPolicyError } = await supabaseAdmin.rpc("create_public_policy", {
      table_name: "news",
      policy_name: "Allow all operations for public",
      operation: "ALL",
    })

    if (createPolicyError) {
      console.error("Помилка при створенні політики для таблиці news:", createPolicyError)
      return NextResponse.json({ error: createPolicyError.message }, { status: 500 })
    }

    // Вмикаємо RLS для таблиці news
    const { error: enableRlsError } = await supabaseAdmin.rpc("enable_rls", { table_name: "news" })

    if (enableRlsError) {
      console.error("Помилка при вмиканні RLS для таблиці news:", enableRlsError)
      return NextResponse.json({ error: enableRlsError.message }, { status: 500 })
    }

    // Крок 2: Налаштування bucket для зображень
    console.log("Крок 2: Налаштування bucket для зображень...")

    // Перевіряємо, чи існує bucket
    const { data: buckets, error: listBucketsError } = await supabaseAdmin.storage.listBuckets()

    if (listBucketsError) {
      console.error("Помилка при отриманні списку buckets:", listBucketsError)
      return NextResponse.json({ error: listBucketsError.message }, { status: 500 })
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "images")

    if (!bucketExists) {
      // Створюємо bucket, якщо він не існує
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createBucketError) {
        console.error("Помилка при створенні bucket images:", createBucketError)
        return NextResponse.json({ error: createBucketError.message }, { status: 500 })
      }
    } else {
      // Оновлюємо налаштування існуючого bucket
      const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (updateBucketError) {
        console.error("Помилка при оновленні налаштувань bucket images:", updateBucketError)
        return NextResponse.json({ error: updateBucketError.message }, { status: 500 })
      }
    }

    // Крок 3: Налаштування публічного доступу до bucket
    console.log("Крок 3: Налаштування публічного доступу до bucket...")

    const { error: setupBucketAccessError } = await supabaseAdmin.rpc("setup_public_bucket_access", {
      bucket_name: "images",
    })

    if (setupBucketAccessError) {
      console.error("Помилка при налаштуванні публічного доступу до bucket:", setupBucketAccessError)
      return NextResponse.json({ error: setupBucketAccessError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Дозволи успішно налаштовано",
      instructions: "Тепер ви можете додавати новини та завантажувати зображення",
    })
  } catch (error) {
    console.error("Неочікувана помилка при налаштуванні дозволів:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

