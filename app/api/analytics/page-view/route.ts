import { type NextRequest, NextResponse } from "next/server"
import { recordPageView } from "@/lib/services/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const { pagePath, sessionId } = await request.json()

    if (!pagePath) {
      return NextResponse.json({ error: "Missing pagePath parameter" }, { status: 400 })
    }

    await recordPageView(pagePath, sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording page view:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

