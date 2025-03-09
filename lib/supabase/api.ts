"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Функції для роботи з новинами
export async function getNews(page = 1, limit = 10, search = "", language = "uk") {
  const supabase = createClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from("news")
    .select(`
      *,
      news_translations!inner(*)
    `)
    .eq("news_translations.language", language)

  if (search) {
    query = query.or(`title.ilike.%${search}%, news_translations.title.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order("publish_date", { ascending: false })
    .range(offset, offset + limit - 1)
    .limit(limit)

  if (error) {
    console.error("Error fetching news:", error)
    throw new Error(`Помилка при отриманні новин: ${error.message}`)
  }

  // Отримуємо загальну кількість для пагінації
  const { count: totalCount, error: countError } = await supabase.from("news").select("*", { count: "exact" })

  if (countError) {
    console.error("Error counting news:", countError)
  }

  // Трансформуємо дані для відображення
  const transformedData = data.map((item) => {
    const translation = item.news_translations[0]
    return {
      id: item.id,
      title: translation?.title || item.title,
      content: translation?.content || item.content,
      excerpt: translation?.excerpt || item.excerpt,
      slug: translation?.slug || item.slug,
      image_url: item.image_url,
      category_id: item.category_id,
      is_featured: item.is_featured,
      is_published: item.is_published,
      publish_date: item.publish_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      language: translation?.language || language,
    }
  })

  return {
    data: transformedData,
    count: totalCount || 0,
    page,
    limit,
  }
}

export async function getNewsById(id: string) {
  const supabase = createClient()

  // Отримуємо основні дані новини
  const { data: newsData, error: newsError } = await supabase.from("news").select("*").eq("id", id).single()

  if (newsError) {
    console.error("Error fetching news by ID:", newsError)
    throw new Error(`Помилка при отриманні новини: ${newsError.message}`)
  }

  // Отримуємо переклади
  const { data: translationsData, error: translationsError } = await supabase
    .from("news_translations")
    .select("*")
    .eq("news_id", id)

  if (translationsError) {
    console.error("Error fetching news translations:", translationsError)
    throw new Error(`Помилка при отриманні перекладів: ${translationsError.message}`)
  }

  // Отримуємо теги
  const { data: tagsData, error: tagsError } = await supabase
    .from("news_tags")
    .select(`
      *,
      tags(*)
    `)
    .eq("news_id", id)

  if (tagsError) {
    console.error("Error fetching news tags:", tagsError)
  }

  // Форматуємо дані для відображення
  const formattedData = {
    ...newsData,
    translations: {},
    tags: tagsData?.map((tag) => tag.tags) || [],
  }

  // Додаємо переклади
  translationsData?.forEach((translation) => {
    formattedData.translations[translation.language] = {
      title: translation.title,
      content: translation.content,
      excerpt: translation.excerpt,
      slug: translation.slug,
    }
  })

  return formattedData
}

export async function createNews(data: any) {
  const supabase = createClient()

  try {
    // Створюємо основний запис новини
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .insert({
        title: data.title.uk, // Основна мова - українська
        content: data.content.uk,
        excerpt: data.excerpt.uk,
        slug: data.slug.uk,
        image_url: data.image,
        category_id: data.category,
        is_featured: data.featured,
        is_published: data.published,
        publish_date: data.publish_date,
      })
      .select()

    if (newsError) {
      console.error("Error creating news:", newsError)
      throw new Error(`Помилка при створенні новини: ${newsError.message}`)
    }

    const newsId = newsData[0].id

    // Створюємо переклади
    const translations = Object.keys(data.title).map((lang) => ({
      news_id: newsId,
      language: lang,
      title: data.title[lang],
      content: data.content[lang],
      excerpt: data.excerpt[lang],
      slug: data.slug[lang],
    }))

    const { error: translationsError } = await supabase.from("news_translations").insert(translations)

    if (translationsError) {
      console.error("Error creating translations:", translationsError)
      throw new Error(`Помилка при створенні перекладів: ${translationsError.message}`)
    }

    // Додаємо теги, якщо вони є
    if (data.tags && data.tags.length > 0) {
      // Спочатку перевіряємо, чи існують теги, і створюємо нові, якщо потрібно
      for (const tagName of data.tags) {
        const { data: existingTag, error: tagCheckError } = await supabase
          .from("tags")
          .select("*")
          .eq("name", tagName)
          .maybeSingle()

        if (tagCheckError) {
          console.error("Error checking tag:", tagCheckError)
          continue
        }

        let tagId

        if (!existingTag) {
          // Створюємо новий тег
          const { data: newTag, error: createTagError } = await supabase
            .from("tags")
            .insert({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, "-"),
            })
            .select()

          if (createTagError) {
            console.error("Error creating tag:", createTagError)
            continue
          }

          tagId = newTag[0].id
        } else {
          tagId = existingTag.id
        }

        // Зв'язуємо тег з новиною
        const { error: linkTagError } = await supabase.from("news_tags").insert({
          news_id: newsId,
          tag_id: tagId,
        })

        if (linkTagError) {
          console.error("Error linking tag to news:", linkTagError)
        }
      }
    }

    revalidatePath("/admin/news")
    return { success: true, id: newsId }
  } catch (error) {
    console.error("Error in createNews:", error)
    return { success: false, error: error instanceof Error ? error.message : "Невідома помилка" }
  }
}

export async function updateNews(id: string, data: any) {
  const supabase = createClient()

  try {
    // Оновлюємо основний запис новини
    const { error: newsError } = await supabase
      .from("news")
      .update({
        title: data.title.uk, // Основна мова - українська
        content: data.content.uk,
        excerpt: data.excerpt.uk,
        slug: data.slug.uk,
        image_url: data.image,
        category_id: data.category,
        is_featured: data.featured,
        is_published: data.published,
        publish_date: data.publish_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (newsError) {
      console.error("Error updating news:", newsError)
      throw new Error(`Помилка при оновленні новини: ${newsError.message}`)
    }

    // Оновлюємо переклади
    for (const lang of Object.keys(data.title)) {
      // Перевіряємо, чи існує переклад
      const { data: existingTranslation, error: checkError } = await supabase
        .from("news_translations")
        .select("*")
        .eq("news_id", id)
        .eq("language", lang)
        .maybeSingle()

      if (checkError) {
        console.error(`Error checking translation for ${lang}:`, checkError)
        continue
      }

      if (existingTranslation) {
        // Оновлюємо існуючий переклад
        const { error: updateError } = await supabase
          .from("news_translations")
          .update({
            title: data.title[lang],
            content: data.content[lang],
            excerpt: data.excerpt[lang],
            slug: data.slug[lang],
          })
          .eq("id", existingTranslation.id)

        if (updateError) {
          console.error(`Error updating translation for ${lang}:`, updateError)
        }
      } else {
        // Створюємо новий переклад
        const { error: insertError } = await supabase.from("news_translations").insert({
          news_id: id,
          language: lang,
          title: data.title[lang],
          content: data.content[lang],
          excerpt: data.excerpt[lang],
          slug: data.slug[lang],
        })

        if (insertError) {
          console.error(`Error creating translation for ${lang}:`, insertError)
        }
      }
    }

    // Оновлюємо теги
    // Спочатку видаляємо всі існуючі зв'язки
    const { error: deleteTagsError } = await supabase.from("news_tags").delete().eq("news_id", id)

    if (deleteTagsError) {
      console.error("Error deleting existing tags:", deleteTagsError)
    }

    // Додаємо нові теги
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const { data: existingTag, error: tagCheckError } = await supabase
          .from("tags")
          .select("*")
          .eq("name", tagName)
          .maybeSingle()

        if (tagCheckError) {
          console.error("Error checking tag:", tagCheckError)
          continue
        }

        let tagId

        if (!existingTag) {
          // Створюємо новий тег
          const { data: newTag, error: createTagError } = await supabase
            .from("tags")
            .insert({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, "-"),
            })
            .select()

          if (createTagError) {
            console.error("Error creating tag:", createTagError)
            continue
          }

          tagId = newTag[0].id
        } else {
          tagId = existingTag.id
        }

        // Зв'язуємо тег з новиною
        const { error: linkTagError } = await supabase.from("news_tags").insert({
          news_id: id,
          tag_id: tagId,
        })

        if (linkTagError) {
          console.error("Error linking tag to news:", linkTagError)
        }
      }
    }

    revalidatePath("/admin/news")
    revalidatePath(`/admin/news/edit/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error in updateNews:", error)
    return { success: false, error: error instanceof Error ? error.message : "Невідома помилка" }
  }
}

export async function deleteNews(id: string) {
  const supabase = createClient()

  try {
    // Видаляємо зв'язки з тегами
    const { error: deleteTagsError } = await supabase.from("news_tags").delete().eq("news_id", id)

    if (deleteTagsError) {
      console.error("Error deleting news tags:", deleteTagsError)
    }

    // Видаляємо переклади
    const { error: deleteTranslationsError } = await supabase.from("news_translations").delete().eq("news_id", id)

    if (deleteTranslationsError) {
      console.error("Error deleting news translations:", deleteTranslationsError)
      throw new Error(`Помилка при видаленні перекладів: ${deleteTranslationsError.message}`)
    }

    // Видаляємо основний запис новини
    const { error: deleteNewsError } = await supabase.from("news").delete().eq("id", id)

    if (deleteNewsError) {
      console.error("Error deleting news:", deleteNewsError)
      throw new Error(`Помилка при видаленні новини: ${deleteNewsError.message}`)
    }

    revalidatePath("/admin/news")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteNews:", error)
    return { success: false, error: error instanceof Error ? error.message : "Невідома помилка" }
  }
}

// Функції для отримання статистики
export async function getDashboardStats() {
  const supabase = createClient()

  try {
    // Отримуємо кількість новин
    const { count: newsCount, error: newsError } = await supabase.from("news").select("*", { count: "exact" })

    if (newsError) {
      console.error("Error counting news:", newsError)
    }

    // Отримуємо кількість музики (припускаємо, що є таблиця music)
    const { count: musicCount, error: musicError } = await supabase
      .from("music")
      .select("*", { count: "exact" })
      .catchError((_) => ({ count: 0, error: null })) // Якщо таблиці немає, повертаємо 0

    if (musicError) {
      console.error("Error counting music:", musicError)
    }

    // Отримуємо кількість програм (припускаємо, що є таблиця programs)
    const { count: programsCount, error: programsError } = await supabase
      .from("programs")
      .select("*", { count: "exact" })
      .catchError((_) => ({ count: 0, error: null })) // Якщо таблиці немає, повертаємо 0

    if (programsError) {
      console.error("Error counting programs:", programsError)
    }

    // Отримуємо кількість виконавців (припускаємо, що є таблиця artists)
    const { count: artistsCount, error: artistsError } = await supabase
      .from("artists")
      .select("*", { count: "exact" })
      .catchError((_) => ({ count: 0, error: null })) // Якщо таблиці немає, повертаємо 0

    if (artistsError) {
      console.error("Error counting artists:", artistsError)
    }

    return {
      news: newsCount || 0,
      music: musicCount || 0,
      programs: programsCount || 0,
      artists: artistsCount || 0,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      news: 0,
      music: 0,
      programs: 0,
      artists: 0,
    }
  }
}

export async function getRecentContent(limit = 5) {
  const supabase = createClient()

  try {
    // Отримуємо останні новини
    const { data: recentNews, error: newsError } = await supabase
      .from("news")
      .select(`
        id,
        title,
        updated_at,
        created_at
      `)
      .order("updated_at", { ascending: false })
      .limit(limit)

    if (newsError) {
      console.error("Error fetching recent news:", newsError)
    }

    // Отримуємо останню музику (якщо є)
    const { data: recentMusic, error: musicError } = await supabase
      .from("music")
      .select(`
        id,
        title,
        updated_at,
        created_at
      `)
      .order("updated_at", { ascending: false })
      .limit(limit)
      .catchError((_) => ({ data: [], error: null })) // Якщо таблиці немає, повертаємо пустий масив

    if (musicError) {
      console.error("Error fetching recent music:", musicError)
    }

    // Отримуємо останні програми (якщо є)
    const { data: recentPrograms, error: programsError } = await supabase
      .from("programs")
      .select(`
        id,
        title,
        updated_at,
        created_at
      `)
      .order("updated_at", { ascending: false })
      .limit(limit)
      .catchError((_) => ({ data: [], error: null })) // Якщо таблиці немає, повертаємо пустий масив

    if (programsError) {
      console.error("Error fetching recent programs:", programsError)
    }

    // Форматуємо дані для відображення
    const formattedNews =
      recentNews?.map((item) => ({
        id: item.id,
        title: item.title,
        type: "news",
        updatedAt: item.updated_at,
        author: "admin@cheriefm.ua", // В реальному проекті тут буде інформація про автора
      })) || []

    const formattedMusic =
      recentMusic?.map((item) => ({
        id: item.id,
        title: item.title,
        type: "music",
        updatedAt: item.updated_at,
        author: "admin@cheriefm.ua",
      })) || []

    const formattedPrograms =
      recentPrograms?.map((item) => ({
        id: item.id,
        title: item.title,
        type: "program",
        updatedAt: item.updated_at,
        author: "admin@cheriefm.ua",
      })) || []

    // Об'єднуємо всі дані, сортуємо за датою та обмежуємо кількість
    const allContent = [...formattedNews, ...formattedMusic, ...formattedPrograms]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)

    return allContent
  } catch (error) {
    console.error("Error getting recent content:", error)
    return []
  }
}

// Функції для роботи з категоріями
export async function getCategories(language = "uk") {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      category_translations!inner(*)
    `)
    .eq("category_translations.language", language)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Трансформуємо дані для відображення
  const transformedData = data.map((item) => {
    const translation = item.category_translations[0]
    return {
      id: item.id,
      name: translation?.name || item.name,
      slug: translation?.slug || item.slug,
    }
  })

  return transformedData
}

// Функції для роботи з мовами
export async function getLanguages() {
  const supabase = createClient()

  const { data, error } = await supabase.from("languages").select("*").order("is_default", { ascending: false })

  if (error) {
    console.error("Error fetching languages:", error)
    return [
      { code: "uk", name: "Українська", is_default: true },
      { code: "fr", name: "Французька", is_default: false },
      { code: "en", name: "Англійська", is_default: false },
    ]
  }

  return data
}

