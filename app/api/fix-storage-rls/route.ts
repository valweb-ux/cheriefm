import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Початок виправлення RLS для storage...")

    // Крок 1: Перевірка наявності bucket
    const supabaseAdmin = getSupabaseAdmin()
    const { data: buckets, error: listBucketsError } = await supabaseAdmin.storage.listBuckets()

    if (listBucketsError) {
      console.error("Помилка при отриманні списку buckets:", listBucketsError)
      return NextResponse.json({ error: listBucketsError.message }, { status: 500 })
    }

    const imagesBucket = buckets.find((bucket) => bucket.name === "images")

    if (!imagesBucket) {
      console.log("Bucket 'images' не знайдено, створюємо...")

      // Створюємо bucket
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createBucketError) {
        console.error("Помилка при створенні bucket 'images':", createBucketError)
        return NextResponse.json({ error: createBucketError.message }, { status: 500 })
      }

      console.log("Bucket 'images' успішно створено")
    } else {
      console.log("Bucket 'images' вже існує, оновлюємо налаштування...")

      // Оновлюємо налаштування bucket
      const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (updateBucketError) {
        console.error("Помилка при оновленні налаштувань bucket 'images':", updateBucketError)
        return NextResponse.json({ error: updateBucketError.message }, { status: 500 })
      }

      console.log("Налаштування bucket 'images' успішно оновлено")
    }

    // Крок 2: Виконання SQL-запитів для налаштування RLS
    console.log("Виконання SQL-запитів для налаштування RLS...")

    // Вимикаємо RLS для таблиці storage.objects
    const { error: disableRlsError } = await supabaseAdmin.rpc("disable_rls_for_storage")

    if (disableRlsError) {
      console.error("Помилка при вимкненні RLS для таблиці storage.objects:", disableRlsError)
      return NextResponse.json({ error: disableRlsError.message }, { status: 500 })
    }

    console.log("RLS для таблиці storage.objects успішно вимкнено")

    return NextResponse.json({
      message: "Налаштування RLS для storage успішно виправлено",
      instructions: "Тепер ви можете завантажувати зображення без помилок RLS",
    })
  } catch (error) {
    console.error("Неочікувана помилка при виправленні RLS для storage:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

