import { type NextRequest, NextResponse } from "next/server"
import { recordRadioListening } from "@/lib/services/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const { programId, listenDuration, userId, sessionId } = await request.json()

    if (listenDuration === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await recordRadioListening(programId, listenDuration, userId, sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording radio listening:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

