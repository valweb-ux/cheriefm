import { type NextRequest, NextResponse } from "next/server"
import { recordTrackPlay } from "@/lib/services/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const { trackId, playDuration, completed, userId, sessionId } = await request.json()

    if (!trackId || playDuration === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await recordTrackPlay(trackId, playDuration, completed, userId, sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording track play:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

