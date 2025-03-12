import { createClient } from "@supabase/supabase-js"

// Функція для створення клієнта Supabase Admin
// Ми використовуємо функцію замість прямої ініціалізації, щоб уникнути помилок під час збірки
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing environment variables for Supabase Admin")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Функція для додавання новини з використанням сервісної ролі
export async function addNewsAdmin(title: string, content: string, publish_date?: string, image_url?: string) {
  const now = new Date().toISOString()
  const supabaseAdmin = getSupabaseAdmin()

  console.log("Додавання новини з використанням сервісної ролі:")
  console.log("Заголовок:", title)
  console.log("Зміст:", content.substring(0, 100) + "...")
  console.log("Дата публікації:", publish_date || now)
  console.log("URL зображення:", image_url)

  const { data, error } = await supabaseAdmin
    .from("news")
    .insert([
      {
        title,
        content,
        created_at: now,
        publish_date: publish_date || now,
        image_url,
      },
    ])
    .select()

  if (error) {
    console.error("Помилка при додаванні новини:", error)
    throw error
  }

  console.log("Новину успішно додано:", data[0])
  return data[0]
}

// Функція для оновлення новини з використанням сервісної ролі
export async function updateNewsAdmin(
  id: number,
  title: string,
  content: string,
  publish_date?: string,
  image_url?: string,
) {
  const supabaseAdmin = getSupabaseAdmin()

  console.log("Оновлення новини з використанням сервісної ролі:")
  console.log("ID:", id)
  console.log("Заголовок:", title)
  console.log("Зміст:", content.substring(0, 100) + "...")
  console.log("Дата публікації:", publish_date)
  console.log("URL зображення:", image_url)

  const updateData: { title: string; content: string; publish_date?: string; image_url?: string } = {
    title,
    content,
  }

  if (publish_date) {
    updateData.publish_date = publish_date
  }

  if (image_url !== undefined) {
    updateData.image_url = image_url
  }

  const { data, error } = await supabaseAdmin.from("news").update(updateData).eq("id", id).select()

  if (error) {
    console.error("Помилка при оновленні новини:", error)
    throw error
  }

  console.log("Новину успішно оновлено:", data[0])
  return data[0]
}

