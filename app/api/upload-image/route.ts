import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    // Отримуємо файл з запиту
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Файл не знайдено" }, { status: 400 })
    }

    console.log("Отримано файл для завантаження:", file.name, file.type, file.size)

    // Перевіряємо, чи це зображення
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: `Файл не є зображенням: ${file.type}` }, { status: 400 })
    }

    // Генеруємо унікальне ім'я файлу
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `news/${fileName}`

    console.log("Завантаження файлу в Supabase Storage:", filePath)

    // Завантажуємо в Supabase Storage використовуючи сервісну роль
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.storage.from("images").upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Помилка при завантаженні файлу:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Отримуємо публічний URL зображення
    const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)

    console.log("Файл успішно завантажено, URL:", urlData.publicUrl)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error("Неочікувана помилка при завантаженні файлу:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося завантажити файл" },
      { status: 500 },
    )
  }
}

