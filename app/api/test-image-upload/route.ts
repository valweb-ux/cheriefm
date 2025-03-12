import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createStorageBucketIfNotExists } from "@/lib/supabase"

export async function GET() {
  try {
    // Ініціалізуємо bucket
    const bucketResult = await createStorageBucketIfNotExists("images")
    console.log("Результат створення bucket:", bucketResult)

    // Перевіряємо доступ до bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Помилка при отриманні списку buckets:", listError)
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    // Перевіряємо, чи існує bucket
    const bucket = buckets.find((b) => b.name === "images")

    if (!bucket) {
      return NextResponse.json({ error: "Bucket 'images' не знайдено" }, { status: 404 })
    }

    // Перевіряємо вміст bucket
    const { data: files, error: listFilesError } = await supabase.storage.from("images").list()

    if (listFilesError) {
      console.error("Помилка при отриманні списку файлів:", listFilesError)
      return NextResponse.json({ error: listFilesError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Тест завантаження зображень",
      buckets,
      bucket,
      files: files || [],
    })
  } catch (error) {
    console.error("Неочікувана помилка при тестуванні завантаження зображень:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

