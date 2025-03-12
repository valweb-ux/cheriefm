import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path") || ""
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const search = searchParams.get("search") || ""
    const dateFilter = searchParams.get("date") || "all"

    const pageSize = 20
    const offset = (page - 1) * pageSize

    console.log("API: Отримання списку медіа-файлів з шляху:", path)
    console.log("Пошук:", search, "Фільтр дати:", dateFilter, "Сторінка:", page)

    const supabaseAdmin = getSupabaseAdmin()

    // Отримуємо список файлів
    const query = supabaseAdmin.storage.from("images").list(path, {
      limit: pageSize,
      offset: offset,
      sortBy: { column: "created_at", order: "desc" },
    })

    const { data, error } = await query

    if (error) {
      console.error("API: Помилка при отриманні списку медіа-файлів:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Фільтруємо файли за пошуковим запитом
    let filteredData = data || []
    if (search) {
      filteredData = filteredData.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Отримуємо всі файли для підрахунку загальної кількості
    // Це тимчасове рішення, оскільки Supabase не підтримує count в storage.list
    const { data: allData, error: allDataError } = await supabaseAdmin.storage.from("images").list(path)

    if (allDataError) {
      console.error("API: Помилка при отриманні всіх медіа-файлів:", allDataError)
    }

    const totalCount = allData ? allData.length : filteredData.length

    // Отримуємо публічні URL для кожного файлу
    const filesWithUrls = filteredData.map((file) => {
      const publicUrl = supabaseAdmin.storage.from("images").getPublicUrl(`${path ? path + "/" : ""}${file.name}`)
        .data.publicUrl

      return {
        ...file,
        publicUrl,
        path: path || "root",
      }
    })

    console.log("API: Отримано медіа-файлів:", filesWithUrls.length)
    return NextResponse.json({
      files: filesWithUrls,
      total: totalCount,
      page,
      pageSize,
    })
  } catch (error) {
    console.error("API: Помилка при отриманні списку медіа-файлів:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося отримати список медіа-файлів" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const path = (formData.get("path") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "Файл не знайдено" }, { status: 400 })
    }

    console.log("API: Завантаження медіа-файлу:", file.name, "тип:", file.type, "розмір:", file.size, "в шлях:", path)

    // Перевіряємо, чи це зображення або інший допустимий тип файлу
    const allowedTypes = ["image/", "audio/", "video/", "application/pdf"]
    const isAllowedType = allowedTypes.some((type) => file.type.startsWith(type))

    if (!isAllowedType && !file.name.endsWith(".folder")) {
      return NextResponse.json(
        {
          error: `Недопустимий тип файлу: ${file.type}. Дозволені типи: зображення, аудіо, відео, PDF.`,
        },
        { status: 400 },
      )
    }

    // Перевірка розміру файлу (максимум 2GB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Файл перевищує максимальний розмір 2GB. Поточний розмір: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        },
        { status: 400 },
      )
    }

    // Спеціальна обробка для відеофайлів
    if (file.type.startsWith("video/")) {
      console.log("API: Завантаження відеофайлу - використовуємо спеціальну обробку")

      // Обмеження розміру відеофайлів до 100MB
      const VIDEO_MAX_SIZE = 100 * 1024 * 1024 // 100MB
      if (file.size > VIDEO_MAX_SIZE) {
        return NextResponse.json(
          {
            error: `Відеофайл перевищує рекомендований розмір 100MB. Поточний розмір: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          },
          { status: 400 },
        )
      }
    }

    // Генеруємо унікальне ім'я файлу
    const fileName = file.name.endsWith(".folder")
      ? file.name
      : `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${file.name.split(".").pop()}`

    const filePath = path ? `${path}/${fileName}` : fileName

    try {
      // Завантажуємо в Supabase Storage
      const supabaseAdmin = getSupabaseAdmin()

      // Додаємо обробку помилок для відеофайлів
      let uploadResult
      try {
        uploadResult = await supabaseAdmin.storage.from("images").upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        })
      } catch (uploadError) {
        console.error("API: Помилка при завантаженні файлу в Supabase:", uploadError)

        // Спеціальне повідомлення для відеофайлів
        if (file.type.startsWith("video/")) {
          return NextResponse.json(
            {
              error: `Помилка при завантаженні відеофайлу. Можливі причини: формат не підтримується, файл пошкоджений або занадто великий. Рекомендовано використовувати MP4 або WebM формат з розміром до 100MB.`,
              details: uploadError instanceof Error ? uploadError.message : JSON.stringify(uploadError),
            },
            { status: 500 },
          )
        }

        throw uploadError
      }

      const { data, error } = uploadResult

      if (error) {
        console.error("API: Помилка при завантаженні медіа-файлу:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Отримуємо публічний URL зображення
      const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)

      console.log("API: Медіа-файл успішно завантажено, URL:", urlData.publicUrl)

      return NextResponse.json({
        url: urlData.publicUrl,
        path: filePath,
        name: fileName,
        size: file.size,
        type: file.type,
      })
    } catch (uploadError) {
      console.error("API: Помилка при завантаженні медіа-файлу:", uploadError)
      return NextResponse.json(
        {
          error: uploadError instanceof Error ? uploadError.message : "Не вдалося завантажити медіа-файл",
          details: JSON.stringify(uploadError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API: Помилка при завантаженні медіа-файлу:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Не вдалося завантажити медіа-файл",
        details: JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}

