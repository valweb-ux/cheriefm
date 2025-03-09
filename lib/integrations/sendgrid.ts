import type { Newsletter, NewsletterCampaign, Subscriber } from "@/types/integrations.types"

interface SendgridConfig {
  apiKey: string
}

interface SendgridResponse {
  success: boolean
  data?: any
  error?: string
}

export async function createSendgridList(newsletter: Newsletter, config: SendgridConfig): Promise<SendgridResponse> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/marketing/lists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newsletter.name,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "Невідома помилка при створенні списку SendGrid",
      }
    }

    return {
      success: true,
      data: {
        listId: data.id,
      },
    }
  } catch (error) {
    console.error("Error creating SendGrid list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні списку SendGrid",
    }
  }
}

export async function addSubscriberToSendgrid(
  subscriber: Subscriber,
  listId: string,
  config: SendgridConfig,
): Promise<SendgridResponse> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_ids: [listId],
        contacts: [
          {
            email: subscriber.email,
            first_name: subscriber.firstName || "",
            last_name: subscriber.lastName || "",
            custom_fields: {
              preferences: JSON.stringify(subscriber.preferences || {}),
            },
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "Невідома помилка при додаванні підписника до SendGrid",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error adding subscriber to SendGrid:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при додаванні підписника до SendGrid",
    }
  }
}

export async function createSendgridCampaign(
  campaign: NewsletterCampaign,
  listId: string,
  config: SendgridConfig,
): Promise<SendgridResponse> {
  try {
    // Крок 1: Створення дизайну
    const designResponse = await fetch("https://api.sendgrid.com/v3/designs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: campaign.subject,
        html_content: campaign.content,
      }),
    })

    const designData = await designResponse.json()

    if (!designResponse.ok) {
      return {
        success: false,
        error: designData.errors?.[0]?.message || "Невідома помилка при створенні дизайну SendGrid",
      }
    }

    const designId = designData.id

    // Крок 2: Створення кампанії
    const campaignResponse = await fetch("https://api.sendgrid.com/v3/marketing/singlesends", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: campaign.subject,
        send_to: {
          list_ids: [listId],
        },
        email_config: {
          subject: campaign.subject,
          sender_id: 1, // ID відправника, потрібно отримати з SendGrid
          design_id: designId,
        },
      }),
    })

    const campaignData = await campaignResponse.json()

    if (!campaignResponse.ok) {
      return {
        success: false,
        error: campaignData.errors?.[0]?.message || "Невідома помилка при створенні кампанії SendGrid",
      }
    }

    return {
      success: true,
      data: {
        campaignId: campaignData.id,
      },
    }
  } catch (error) {
    console.error("Error creating SendGrid campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при створенні кампанії SendGrid",
    }
  }
}

export async function sendSendgridCampaign(campaignId: string, config: SendgridConfig): Promise<SendgridResponse> {
  try {
    const response = await fetch(`https://api.sendgrid.com/v3/marketing/singlesends/${campaignId}/schedule`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        send_at: "now",
      }),
    })

    if (response.status === 204) {
      return {
        success: true,
      }
    }

    const data = await response.json()

    return {
      success: false,
      error: data.errors?.[0]?.message || "Невідома помилка при відправленні кампанії SendGrid",
    }
  } catch (error) {
    console.error("Error sending SendGrid campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при відправленні кампанії SendGrid",
    }
  }
}

export async function scheduleSendgridCampaign(
  campaignId: string,
  scheduledTime: Date,
  config: SendgridConfig,
): Promise<SendgridResponse> {
  try {
    const response = await fetch(`https://api.sendgrid.com/v3/marketing/singlesends/${campaignId}/schedule`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        send_at: scheduledTime.toISOString(),
      }),
    })

    if (response.status === 204) {
      return {
        success: true,
      }
    }

    const data = await response.json()

    return {
      success: false,
      error: data.errors?.[0]?.message || "Невідома помилка при плануванні кампанії SendGrid",
    }
  } catch (error) {
    console.error("Error scheduling SendGrid campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при плануванні кампанії SendGrid",
    }
  }
}

export async function getSendgridCampaignStats(campaignId: string, config: SendgridConfig): Promise<SendgridResponse> {
  try {
    const response = await fetch(`https://api.sendgrid.com/v3/marketing/stats/singlesends/${campaignId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "Невідома помилка при отриманні статистики кампанії SendGrid",
      }
    }

    return {
      success: true,
      data: {
        opens: data.opens,
        clicks: data.clicks,
        recipients: data.recipients,
        openRate: data.opens / data.recipients,
        clickRate: data.clicks / data.recipients,
      },
    }
  } catch (error) {
    console.error("Error getting SendGrid campaign stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка при отриманні статистики кампанії SendGrid",
    }
  }
}

