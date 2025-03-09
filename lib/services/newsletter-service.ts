import { createClient } from "@/lib/supabase/server"
import type { Newsletter, NewsletterTemplate, NewsletterCampaign, Subscriber } from "@/types/integrations.types"

// Управління розсилками
export async function getNewsletters(): Promise<Newsletter[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("newsletters").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching newsletters:", error)
    throw new Error(`Помилка при отриманні розсилок: ${error.message}`)
  }

  return data as Newsletter[]
}

export async function getNewsletter(id: string): Promise<Newsletter> {
  const supabase = createClient()

  const { data, error } = await supabase.from("newsletters").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching newsletter:", error)
    throw new Error(`Помилка при отриманні розсилки: ${error.message}`)
  }

  return data as Newsletter
}

export async function createNewsletter(
  newsletter: Omit<Newsletter, "id" | "createdAt" | "updatedAt" | "subscriberCount">,
): Promise<Newsletter> {
  const supabase = createClient()

  const newNewsletter = {
    ...newsletter,
    subscriberCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const { data, error } = await supabase.from("newsletters").insert(newNewsletter).select().single()

  if (error) {
    console.error("Error creating newsletter:", error)
    throw new Error(`Помилка при створенні розсилки: ${error.message}`)
  }

  return data as Newsletter
}

export async function updateNewsletter(
  id: string,
  newsletter: Partial<Omit<Newsletter, "id" | "createdAt" | "subscriberCount">>,
): Promise<Newsletter> {
  const supabase = createClient()

  const updatedNewsletter = {
    ...newsletter,
    updatedAt: new Date(),
  }

  const { data, error } = await supabase.from("newsletters").update(updatedNewsletter).eq("id", id).select().single()

  if (error) {
    console.error("Error updating newsletter:", error)
    throw new Error(`Помилка при оновленні розсилки: ${error.message}`)
  }

  return data as Newsletter
}

export async function deleteNewsletter(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("newsletters").delete().eq("id", id)

  if (error) {
    console.error("Error deleting newsletter:", error)
    throw new Error(`Помилка при видаленні розсилки: ${error.message}`)
  }
}

// Управління шаблонами
export async function getNewsletterTemplates(): Promise<NewsletterTemplate[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("newsletter_templates").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching newsletter templates:", error)
    throw new Error(`Помилка при отриманні шаблонів розсилок: ${error.message}`)
  }

  return data as NewsletterTemplate[]
}

export async function getNewsletterTemplate(id: string): Promise<NewsletterTemplate> {
  const supabase = createClient()

  const { data, error } = await supabase.from("newsletter_templates").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching newsletter template:", error)
    throw new Error(`Помилка при отриманні шаблону розсилки: ${error.message}`)
  }

  return data as NewsletterTemplate
}

export async function createNewsletterTemplate(
  template: Omit<NewsletterTemplate, "id" | "createdAt" | "updatedAt">,
): Promise<NewsletterTemplate> {
  const supabase = createClient()

  const newTemplate = {
    ...template,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const { data, error } = await supabase.from("newsletter_templates").insert(newTemplate).select().single()

  if (error) {
    console.error("Error creating newsletter template:", error)
    throw new Error(`Помилка при створенні шаблону розсилки: ${error.message}`)
  }

  return data as NewsletterTemplate
}

export async function updateNewsletterTemplate(
  id: string,
  template: Partial<Omit<NewsletterTemplate, "id" | "createdAt">>,
): Promise<NewsletterTemplate> {
  const supabase = createClient()

  const updatedTemplate = {
    ...template,
    updatedAt: new Date(),
  }

  const { data, error } = await supabase
    .from("newsletter_templates")
    .update(updatedTemplate)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating newsletter template:", error)
    throw new Error(`Помилка при оновленні шаблону розсилки: ${error.message}`)
  }

  return data as NewsletterTemplate
}

export async function deleteNewsletterTemplate(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("newsletter_templates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting newsletter template:", error)
    throw new Error(`Помилка при видаленні шаблону розсилки: ${error.message}`)
  }
}

// Управління кампаніями
export async function getNewsletterCampaigns(
  limit = 10,
  offset = 0,
  status?: string,
): Promise<{ campaigns: NewsletterCampaign[]; count: number }> {
  const supabase = createClient()

  let query = supabase
    .from("newsletter_campaigns")
    .select("*", { count: "exact" })
    .order("createdAt", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching newsletter campaigns:", error)
    throw new Error(`Помилка при отриманні кампаній розсилок: ${error.message}`)
  }

  return {
    campaigns: data as NewsletterCampaign[],
    count: count || 0,
  }
}

export async function getNewsletterCampaign(id: string): Promise<NewsletterCampaign> {
  const supabase = createClient()

  const { data, error } = await supabase.from("newsletter_campaigns").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching newsletter campaign:", error)
    throw new Error(`Помилка при отриманні кампанії розсилки: ${error.message}`)
  }

  return data as NewsletterCampaign
}

export async function createNewsletterCampaign(
  campaign: Omit<
    NewsletterCampaign,
    "id" | "createdAt" | "updatedAt" | "sentAt" | "openRate" | "clickRate" | "recipientCount"
  >,
): Promise<NewsletterCampaign> {
  const supabase = createClient()

  const newCampaign = {
    ...campaign,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const { data, error } = await supabase.from("newsletter_campaigns").insert(newCampaign).select().single()

  if (error) {
    console.error("Error creating newsletter campaign:", error)
    throw new Error(`Помилка при створенні кампанії розсилки: ${error.message}`)
  }

  return data as NewsletterCampaign
}

export async function updateNewsletterCampaign(
  id: string,
  campaign: Partial<Omit<NewsletterCampaign, "id" | "createdAt" | "sentAt">>,
): Promise<NewsletterCampaign> {
  const supabase = createClient()

  const updatedCampaign = {
    ...campaign,
    updatedAt: new Date(),
  }

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .update(updatedCampaign)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating newsletter campaign:", error)
    throw new Error(`Помилка при оновленні кампанії розсилки: ${error.message}`)
  }

  return data as NewsletterCampaign
}

export async function deleteNewsletterCampaign(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("newsletter_campaigns").delete().eq("id", id)

  if (error) {
    console.error("Error deleting newsletter campaign:", error)
    throw new Error(`Помилка при видаленні кампанії розсилки: ${error.message}`)
  }
}

// Управління підписниками
export async function getSubscribers(
  limit = 10,
  offset = 0,
  isActive?: boolean,
): Promise<{ subscribers: Subscriber[]; count: number }> {
  const supabase = createClient()

  let query = supabase.from("subscribers").select("*", { count: "exact" }).order("subscribedAt", { ascending: false })

  if (isActive !== undefined) {
    query = query.eq("isActive", isActive)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching subscribers:", error)
    throw new Error(`Помилка при отриманні підписників: ${error.message}`)
  }

  return {
    subscribers: data as Subscriber[],
    count: count || 0,
  }
}

export async function getSubscriber(id: string): Promise<Subscriber> {
  const supabase = createClient()

  const { data, error } = await supabase.from("subscribers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching subscriber:", error)
    throw new Error(`Помилка при отриманні підписника: ${error.message}`)
  }

  return data as Subscriber
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("subscribers").select("*").eq("email", email).maybeSingle()

  if (error) {
    console.error("Error fetching subscriber by email:", error)
    throw new Error(`Помилка при отриманні підписника за email: ${error.message}`)
  }

  return data as Subscriber | null
}

export async function createSubscriber(subscriber: Omit<Subscriber, "id" | "subscribedAt">): Promise<Subscriber> {
  const supabase = createClient()

  // Перевіряємо, чи існує вже такий email
  const existingSubscriber = await getSubscriberByEmail(subscriber.email)

  if (existingSubscriber) {
    if (!existingSubscriber.isActive) {
      // Якщо підписник існує, але неактивний, активуємо його
      return updateSubscriber(existingSubscriber.id, {
        isActive: true,
        unsubscribedAt: null,
        newsletterIds: subscriber.newsletterIds,
        preferences: subscriber.preferences,
      })
    }

    // Якщо підписник вже активний, оновлюємо його налаштування
    return updateSubscriber(existingSubscriber.id, {
      newsletterIds: subscriber.newsletterIds,
      preferences: subscriber.preferences,
    })
  }

  // Створюємо нового підписника
  const newSubscriber = {
    ...subscriber,
    subscribedAt: new Date(),
    isActive: true,
  }

  const { data, error } = await supabase.from("subscribers").insert(newSubscriber).select().single()

  if (error) {
    console.error("Error creating subscriber:", error)
    throw new Error(`Помилка при створенні підписника: ${error.message}`)
  }

  // Оновлюємо лічильник підписників для кожної розсилки
  for (const newsletterId of subscriber.newsletterIds) {
    await incrementNewsletterSubscriberCount(newsletterId)
  }

  return data as Subscriber
}

export async function updateSubscriber(
  id: string,
  subscriber: Partial<Omit<Subscriber, "id" | "subscribedAt">>,
): Promise<Subscriber> {
  const supabase = createClient()

  // Отримуємо поточні дані підписника для порівняння
  const currentSubscriber = await getSubscriber(id)

  const { data, error } = await supabase.from("subscribers").update(subscriber).eq("id", id).select().single()

  if (error) {
    console.error("Error updating subscriber:", error)
    throw new Error(`Помилка при оновленні підписника: ${error.message}`)
  }

  // Якщо змінився статус активності, оновлюємо лічильники
  if (subscriber.isActive !== undefined && subscriber.isActive !== currentSubscriber.isActive) {
    for (const newsletterId of currentSubscriber.newsletterIds) {
      if (subscriber.isActive) {
        await incrementNewsletterSubscriberCount(newsletterId)
      } else {
        await decrementNewsletterSubscriberCount(newsletterId)
      }
    }
  }

  // Якщо змінився список розсилок, оновлюємо лічильники
  if (subscriber.newsletterIds !== undefined) {
    const addedNewsletterIds = subscriber.newsletterIds.filter((id) => !currentSubscriber.newsletterIds.includes(id))
    const removedNewsletterIds = currentSubscriber.newsletterIds.filter((id) => !subscriber.newsletterIds.includes(id))

    for (const newsletterId of addedNewsletterIds) {
      await incrementNewsletterSubscriberCount(newsletterId)
    }

    for (const newsletterId of removedNewsletterIds) {
      await decrementNewsletterSubscriberCount(newsletterId)
    }
  }

  return data as Subscriber
}

export async function deleteSubscriber(id: string): Promise<void> {
  const supabase = createClient()

  // Отримуємо поточні дані підписника для оновлення лічильників
  const subscriber = await getSubscriber(id)

  const { error } = await supabase.from("subscribers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting subscriber:", error)
    throw new Error(`Помилка при видаленні підписника: ${error.message}`)
  }

  // Оновлюємо лічильник підписників для кожної розсилки
  if (subscriber.isActive) {
    for (const newsletterId of subscriber.newsletterIds) {
      await decrementNewsletterSubscriberCount(newsletterId)
    }
  }
}

export async function unsubscribe(email: string, newsletterId?: string): Promise<void> {
  const subscriber = await getSubscriberByEmail(email)

  if (!subscriber) {
    return
  }

  if (newsletterId) {
    // Відписуємося від конкретної розсилки
    const newsletterIds = subscriber.newsletterIds.filter((id) => id !== newsletterId)

    await updateSubscriber(subscriber.id, {
      newsletterIds,
      unsubscribedAt: newsletterIds.length === 0 ? new Date() : undefined,
      isActive: newsletterIds.length > 0,
    })
  } else {
    // Відписуємося від усіх розсилок
    await updateSubscriber(subscriber.id, {
      newsletterIds: [],
      unsubscribedAt: new Date(),
      isActive: false,
    })
  }
}

// Допоміжні функції
async function incrementNewsletterSubscriberCount(newsletterId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("increment_newsletter_subscriber_count", { newsletter_id: newsletterId })

  if (error) {
    console.error("Error incrementing newsletter subscriber count:", error)
  }
}

async function decrementNewsletterSubscriberCount(newsletterId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("decrement_newsletter_subscriber_count", { newsletter_id: newsletterId })

  if (error) {
    console.error("Error decrementing newsletter subscriber count:", error)
  }
}

