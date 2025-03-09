import { type NextRequest, NextResponse } from "next/server"
import { updatePageSeoData, getPageSeoData } from "@/lib/services/analytics-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Отримання даних через API
    const result = await getPageSeoData(id)

    if (!result) {
      return NextResponse.json({ error: "Page SEO data not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error getting page SEO data:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    const result = await updatePageSeoData(id, data)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating page SEO data:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

