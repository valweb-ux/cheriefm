import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    // Отримуємо URL зображення з запиту
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "URL зображення не вказано" }, { status: 400 })
    }

    console.log("Отримано запит на завантаження зображення з URL:", imageUrl)

    // Додаємо заголовки для обходу деяких CORS обмежень
    const fetchOptions = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: imageUrl,
      },
    }

    // Завантажуємо зображення з URL
    const response = await fetch(imageUrl, fetchOptions)

    if (!response.ok) {
      console.error(`Помилка завантаження зображення: ${response.status} ${response.statusText}`)

      if (response.status === 403) {
        return NextResponse.json(
          {
            error: `Доступ заборонено (403 Forbidden). Сервер блокує завантаження зображення. Спробуйте спочатку завантажити зображення на ваш комп'ютер, а потім завантажити його через форму.`,
            corsIssue: true,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        { error: `Не вдалося завантажити зображення з URL: ${response.status} ${response.statusText}` },
        { status: 400 },
      )
    }

    // Отримуємо тип контенту
    const contentType = response.headers.get("content-type") || "image/jpeg"

    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: `Файл не є зображенням: ${contentType}` }, { status: 400 })
    }

    // Отримуємо blob зображення
    const imageBlob = await response.blob()

    // Генеруємо унікальне ім'я файлу
    const fileExt = contentType.split("/")[1]
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `news/${fileName}`

    console.log("Завантаження зображення в Supabase Storage:", filePath)

    // Завантажуємо в Supabase Storage використовуючи сервісну роль
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.storage.from("images").upload(filePath, imageBlob, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Помилка при завантаженні зображення в Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Отримуємо публічний URL зображення
    const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)

    console.log("Зображення успішно завантажено, URL:", urlData.publicUrl)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error("Неочікувана помилка при завантаженні зображення з URL:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося завантажити зображення з URL" },
      { status: 500 },
    )
  }
}

