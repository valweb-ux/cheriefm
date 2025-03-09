import type { Newsletter, NewsletterCampaign, Subscriber } from "@/types/integrations.types"

interface MailchimpConfig {
  apiKey: string
  serverPrefix: string
}

interface MailchimpResponse {
  success: boolean
  data?: any
  error?: string
}

export async function createMailchimpList(newsletter: Newsletter, config: MailchimpConfig): Promise<MailchimpResponse> {
  try {
    const response = await fetch(`https://${config.serverPrefix}.api.mailchimp.com/3.0/lists`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newsletter.name,
        contact: {
          company: "Cherie FM",
          address1: "Your Address",
          city: "Your City",
          state: "Your State",
          zip: "Your Zip",
          country: "UA",
        },
        permission_reminder: "Ви підписалися на розсилку Cherie FM",
        campaign_defaults: {
          from_name: "Cherie FM",
          from_email: "newsletter@cheriefm.com",
          subject: "",
          language: "uk",
        },
        email_type_option: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Невідома помилка при створенні списку Mailchimp",
      }
    }

    return {
      success: true,
      data: {
        listId: data.id,
      },
    }
  } catch (error) {
    console.error("Error creating Mailchimp list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні списку Mailchimp",
    }
  }
}

export async function addSubscriberToMailchimp(
  subscriber: Subscriber,
  listId: string,
  config: MailchimpConfig,
): Promise<MailchimpResponse> {
  try {
    // Створюємо MD5 хеш email для Mailchimp API
    const emailHash = require("crypto").createHash("md5").update(subscriber.email.toLowerCase()).digest("hex")

    const response = await fetch(
      `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${emailHash}`,
      {
        method: "PUT", // PUT для оновлення або створення
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: subscriber.email,
          status: subscriber.isActive ? "subscribed" : "unsubscribed",
          merge_fields: {
            FNAME: subscriber.firstName || "",
            LNAME: subscriber.lastName || "",
          },
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Невідома помилка при додаванні підписника до Mailchimp",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error adding subscriber to Mailchimp:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при додаванні підписника до Mailchimp",
    }
  }
}

export async function createMailchimpCampaign(
  campaign: NewsletterCampaign,
  listId: string,
  config: MailchimpConfig,
): Promise<MailchimpResponse> {
  try {
    // Крок 1: Створення кампанії
    const createResponse = await fetch(`https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "regular",
        recipients: {
          list_id: listId,
        },
        settings: {
          subject_line: campaign.subject,
          title: campaign.subject,
          from_name: "Cherie FM",
          reply_to: "newsletter@cheriefm.com",
        },
      }),
    })

    const createData = await createResponse.json()

    if (!createResponse.ok) {
      return {
        success: false,
        error: createData.detail || "Невідома помилка при створенні кампанії Mailchimp",
      }
    }

    const campaignId = createData.id

    // Крок 2: Додавання контенту до кампанії
    const contentResponse = await fetch(
      `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: campaign.content,
        }),
      },
    )

    const contentData = await contentResponse.json()

    if (!contentResponse.ok) {
      return {
        success: false,
        error: contentData.detail || "Невідома помилка при додаванні контенту до кампанії Mailchimp",
      }
    }

    return {
      success: true,
      data: {
        campaignId,
      },
    }
  } catch (error) {
    console.error("Error creating Mailchimp campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні кампанії Mailchimp",
    }
  }
}

export async function sendMailchimpCampaign(campaignId: string, config: MailchimpConfig): Promise<MailchimpResponse> {
  try {
    const response = await fetch(
      `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (response.status === 204) {
      return {
        success: true,
      }
    }

    const data = await response.json()

    return {
      success: false,
      error: data.detail || "Невідома помилка при відправленні кампанії Mailchimp",
    }
  } catch (error) {
    console.error("Error sending Mailchimp campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при відправленні кампанії Mailchimp",
    }
  }
}

export async function scheduleMailchimpCampaign(
  campaignId: string,
  scheduledTime: Date,
  config: MailchimpConfig,
): Promise<MailchimpResponse> {
  try {
    const response = await fetch(
      `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/schedule`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule_time: scheduledTime.toISOString(),
        }),
      },
    )

    if (response.status === 204) {
      return {
        success: true,
      }
    }

    const data = await response.json()

    return {
      success: false,
      error: data.detail || "Невідома помилка при плануванні кампанії Mailchimp",
    }
  } catch (error) {
    console.error("Error scheduling Mailchimp campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при плануванні кампанії Mailchimp",
    }
  }
}

export async function getMailchimpCampaignReport(
  campaignId: string,
  config: MailchimpConfig,
): Promise<MailchimpResponse> {
  try {
    const response = await fetch(`https://${config.serverPrefix}.api.mailchimp.com/3.0/reports/${campaignId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Невідома помилка при отриманні звіту кампанії Mailchimp",
      }
    }

    return {
      success: true,
      data: {
        opens: data.opens,
        clicks: data.clicks,
        recipients: data.emails_sent,
        openRate: data.opens.open_rate,
        clickRate: data.clicks.click_rate,
      },
    }
  } catch (error) {
    console.error("Error getting Mailchimp campaign report:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні звіту кампанії Mailchimp",
    }
  }
}

