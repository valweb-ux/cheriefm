import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing environment variables for Supabase")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function initializeDatabase() {
  console.log("Початок ініціалізації бази даних...")
  try {
    // Перевіряємо, чи існує таблиця news
    const { error: checkError } = await supabase.from("news").select("id").limit(1)

    if (checkError) {
      console.log("Таблиця news не існує, створюємо...")
      // Якщо таблиця не існує, створюємо її
      const { error: createError } = await supabase.rpc("create_news_table")
      if (createError) {
        console.error("Помилка при створенні таблиці news:", createError)
        throw createError
      }
      console.log("Таблиця news успішно створена")
    } else {
      console.log("Таблиця news вже існує")
    }

    console.log("База даних успішно ініціалізована")
  } catch (error) {
    console.error("Неочікувана помилка при ініціалізації бази даних:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getNews(page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  const now = new Date().toISOString()

  try {
    const { data, error, count } = await supabase
      .from("news")
      .select("*", { count: "exact" })
      .lte("publish_date", now) // Показувати тільки опубліковані новини
      .order("publish_date", { ascending: false })
      .range(start, end)

    if (error) {
      console.error("Помилка при отриманні новин:", error)
      throw error
    }

    return {
      news: data || [],
      total: count || 0,
      page,
      pageSize,
    }
  } catch (error) {
    console.error("Неочікувана помилка при отриманні новин:", error)
    throw error
  }
}

export async function getAllNews(page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  try {
    const { data, error, count } = await supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end)

    if (error) {
      console.error("Помилка при отриманні всіх новин:", error)
      throw error
    }

    return {
      news: data || [],
      total: count || 0,
      page,
      pageSize,
    }
  } catch (error) {
    console.error("Неочікувана помилка при отриманні всіх новин:", error)
    throw error
  }
}

export async function getNewsById(id: number) {
  try {
    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      console.error("Помилка при отриманні новини:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Неочікувана помилка при отриманні новини:", error)
    throw error
  }
}

export async function getNewsCount() {
  try {
    const now = new Date().toISOString()
    const { count, error } = await supabase.from("news").select("*", { count: "exact" }).lte("publish_date", now)

    if (error) {
      console.error("Помилка при отриманні кількості новин:", error)
      throw error
    }

    return count || 0
  } catch (error) {
    console.error("Неочікувана помилка при отриманні кількості новин:", error)
    throw error
  }
}

export async function addNews(title: string, content: string, publish_date?: string, image_url?: string) {
  const now = new Date().toISOString()

  console.log("Додавання новини з наступними даними:")
  console.log("Заголовок:", title)
  console.log("Зміст:", content.substring(0, 100) + "...")
  console.log("Дата публікації:", publish_date || now)
  console.log("URL зображення:", image_url)

  const { data, error } = await supabase
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

export async function updateNews(
  id: number,
  title: string,
  content: string,
  publish_date?: string,
  image_url?: string,
) {
  console.log("Оновлення новини з наступними даними:")
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

  const { data, error } = await supabase.from("news").update(updateData).eq("id", id).select()

  if (error) {
    console.error("Помилка при оновленні новини:", error)
    throw error
  }

  console.log("Новину успішно оновлено:", data[0])
  return data[0]
}

export async function deleteNews(id: number) {
  const { error } = await supabase.from("news").delete().eq("id", id)
  if (error) throw error
}

export async function createTestUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    console.error("Error creating test user:", error)
    throw error
  }

  return data
}

export async function testSupabaseConnection() {
  try {
    await getNewsCount()
    return true
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return false
  }
}

export async function getNewsByDate(date: string) {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .gte("publish_date", `${date}T00:00:00`)
      .lt("publish_date", `${date}T23:59:59`)
      .order("publish_date", { ascending: false })

    if (error) {
      console.error("Помилка при отриманні новин за датою:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Неочікувана помилка при отриманні новин за датою:", error)
    throw error
  }
}

export async function getScheduledNews() {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .gt("publish_date", now)
      .order("publish_date", { ascending: true })

    if (error) {
      console.error("Помилка при отриманні запланованих новин:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Неочікувана помилка при отриманні запланованих новин:", error)
    throw error
  }
}

export async function getNewsDates() {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("news")
      .select("publish_date, created_at") // Вибираємо обидва поля
      .lte("publish_date", now)
      .order("publish_date", { ascending: false })

    if (error) {
      console.error("Помилка при отриманні дат новин:", error)
      throw error
    }

    const uniqueDates = [
      ...new Set(data?.map((item) => format(new Date(item.publish_date || item.created_at), "yyyy-MM-dd"))),
    ]
    return uniqueDates
  } catch (error) {
    console.error("Неочікувана помилка при отриманні дат новин:", error)
    throw error
  }
}

// Функція для створення bucket в Supabase Storage, якщо він не існує
export async function createStorageBucketIfNotExists(bucketName: string) {
  try {
    console.log(`Перевірка наявності bucket ${bucketName}...`)

    // Перевіряємо, чи існує bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Помилка при отриманні списку buckets:", listError)
      throw listError
    }

    console.log("Отримано список buckets:", buckets)

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      console.log(`Bucket ${bucketName} не існує, створюємо...`)

      // Створюємо bucket, якщо він не існує
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true, // Робимо bucket публічним
        fileSizeLimit: 10485760, // 10MB ліміт розміру файлу
      })

      if (createError) {
        console.error(`Помилка при створенні bucket ${bucketName}:`, createError)
        throw createError
      }

      console.log(`Bucket ${bucketName} успішно створено`)

      // Налаштовуємо публічний доступ до bucket
      await setupPublicBucketPolicy(bucketName)
    } else {
      console.log(`Bucket ${bucketName} вже існує, оновлюємо налаштування...`)

      // Оновлюємо налаштування існуючого bucket
      await setupPublicBucketPolicy(bucketName)
    }

    return true
  } catch (error) {
    console.error("Неочікувана помилка при створенні bucket:", error)
    throw error
  }
}

// Функція для налаштування публічного доступу до bucket
export async function setupPublicBucketPolicy(bucketName: string) {
  try {
    console.log(`Налаштування публічного доступу для bucket ${bucketName}...`)

    // Спочатку перевіряємо, чи існує bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Помилка при отриманні списку buckets:", listError)
      return false
    }

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      console.error(`Bucket ${bucketName} не існує`)
      return false
    }

    // Оновлюємо налаштування bucket, щоб зробити його публічним
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    })

    if (updateError) {
      console.error(`Помилка при оновленні налаштувань bucket ${bucketName}:`, updateError)
      return false
    }

    console.log(`Публічний доступ для bucket ${bucketName} успішно налаштовано`)
    return true
  } catch (error) {
    console.error("Неочікувана помилка при налаштуванні публічного доступу:", error)
    return false
  }
}

