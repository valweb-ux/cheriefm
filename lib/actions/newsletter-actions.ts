"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createNewsletterCampaign as createCampaign, getNewsletter } from "@/lib/services/newsletter-service"
import { createMailchimpCampaign, sendMailchimpCampaign, scheduleMailchimpCampaign } from "@/lib/integrations/mailchimp"
import { createSendgridCampaign, sendSendgridCampaign, scheduleSendgridCampaign } from "@/lib/integrations/sendgrid"

interface CreateNewsletterCampaignParams {
  subject: string
  content: string
  newsletterIds: string[]
  scheduledFor?: Date
  newsId?: string
  templateId?: string
}

export async function createNewsletterCampaign(params: CreateNewsletterCampaignParams) {
  try {
    const { subject, content, newsletterIds, scheduledFor, newsId, templateId } = params

    // Перевіряємо, чи є розсилки
    if (!newsletterIds.length) {
      return {
        success: false,
        error: "Не вибрано жодної розсилки",
      }
    }

    const results = []

    // Для кожної розсилки створюємо кампанію
    for (const newsletterId of newsletterIds) {
      try {
        const newsletter = await getNewsletter(newsletterId)

        // Створюємо кампанію в базі даних
        const campaign = await createCampaign({
          newsletterId,
          templateId: templateId || "",
          subject,
          content,
          status: scheduledFor ? "scheduled" : "draft",
          scheduledFor,
          newsId,
        })

        // Відправляємо кампанію через відповідний сервіс
        let serviceResult

        if (newsletter.service === "mailchimp" && newsletter.serviceListId) {
          // Отримуємо налаштування Mailchimp
          const supabase = createClient()
          const { data: settings } = await supabase
            .from("integration_settings")
            .select("settings")
            .eq("type", "mailchimp")
            .single()

          if (!settings?.settings) {
            throw new Error("Налаштування Mailchimp не знайдено")
          }

          const mailchimpConfig = {
            apiKey: settings.settings.apiKey,
            serverPrefix: settings.settings.serverPrefix,
          }

          // Створюємо кампанію в Mailchimp
          const createResult = await createMailchimpCampaign(campaign, newsletter.serviceListId, mailchimpConfig)

          if (!createResult.success) {
            throw new Error(createResult.error)
          }

          const campaignId = createResult.data.campaignId

          // Відправляємо або плануємо кампанію
          if (scheduledFor) {
            serviceResult = await scheduleMailchimpCampaign(campaignId, scheduledFor, mailchimpConfig)
          } else {
            serviceResult = await sendMailchimpCampaign(campaignId, mailchimpConfig)
          }
        } else if (newsletter.service === "sendgrid" && newsletter.serviceListId) {
          // Отримуємо налаштування SendGrid
          const supabase = createClient()
          const { data: settings } = await supabase
            .from("integration_settings")
            .select("settings")
            .eq("type", "sendgrid")
            .single()

          if (!settings?.settings) {
            throw new Error("Налаштування SendGrid не знайдено")
          }

          const sendgridConfig = {
            apiKey: settings.settings.apiKey,
          }

          // Створюємо кампанію в SendGrid
          const createResult = await createSendgridCampaign(campaign, newsletter.serviceListId, sendgridConfig)

          if (!createResult.success) {
            throw new Error(createResult.error)
          }

          const campaignId = createResult.data.campaignId

          // Відправляємо або плануємо кампанію
          if (scheduledFor) {
            serviceResult = await scheduleSendgridCampaign(campaignId, scheduledFor, sendgridConfig)
          } else {
            serviceResult = await sendSendgridCampaign(campaignId, sendgridConfig)
          }
        } else if (newsletter.service === "internal") {
          // Для внутрішньої розсилки просто оновлюємо статус
          const supabase = createClient()
          await supabase
            .from("newsletter_campaigns")
            .update({
              status: scheduledFor ? "scheduled" : "sending",
            })
            .eq("id", campaign.id)

          serviceResult = { success: true }
        } else {
          throw new Error("Непідтримуваний сервіс розсилки")
        }

        // Оновлюємо статус кампанії
        if (serviceResult.success) {
          const supabase = createClient()
          await supabase
            .from("newsletter_campaigns")
            .update({
              status: scheduledFor ? "scheduled" : "sending",
            })
            .eq("id", campaign.id)

          results.push({
            newsletterId,
            success: true,
          })
        } else {
          throw new Error(serviceResult.error)
        }
      } catch (error) {
        console.error(`Error creating campaign for newsletter ${newsletterId}:`, error)
        results.push({
          newsletterId,
          success: false,
          error: error instanceof Error ? error.message : "Невідома помилка",
        })
      }
    }

    // Перевіряємо результати
    const hasErrors = results.some((result) => !result.success)
    const allFailed = results.every((result) => !result.success)

    revalidatePath("/admin/news")
    revalidatePath("/admin/integrations/newsletters")

    if (allFailed) {
      return {
        success: false,
        error: "Не вдалося створити жодну розсилку. " + results.map((r) => r.error).join(" "),
      }
    }

    return {
      success: !hasErrors,
      error: hasErrors ? "Деякі розсилки не вдалося створити" : undefined,
      results,
    }
  } catch (error) {
    console.error("Error creating newsletter campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні розсилки",
    }
  }
}

