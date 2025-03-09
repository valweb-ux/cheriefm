"use server"

import { createClient } from "@/lib/supabase/server"
import { cache } from "react"
import { revalidatePath } from "next/cache"

// Кешування запитів для серверних компонентів
export const getNewsById = cache(async (id: string, language = "uk") => {
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

  // Форматуємо дані для відображення
  const formattedData = {
    ...newsData,
    translations: {},
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
})

// Функція для мутацій даних з використанням Server Actions
export async function updateNewsAction(id: string, data: any) {
  const supabase = createClient()

  try {
    // Оновлюємо основний запис новини
    const { error: newsError } = await supabase
      .from("news")
      .update({
        title: data.title.uk, // Основна мова - українська
        content: data.content.uk,
        excerpt: data.excerpt?.uk || null,
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
            excerpt: data.excerpt?.[lang] || null,
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
          excerpt: data.excerpt?.[lang] || null,
          slug: data.slug[lang],
        })

        if (insertError) {
          console.error(`Error creating translation for ${lang}:`, insertError)
        }
      }
    }

    // Інвалідуємо кеш для відповідних шляхів
    revalidatePath("/admin/news")
    revalidatePath(`/admin/news/edit/${id}`)
    revalidatePath(`/news/${data.slug.uk}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateNewsAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка",
    }
  }
}

