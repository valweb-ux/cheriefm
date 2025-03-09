import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("schedule_templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching schedule templates:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/admin/schedule/templates:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const template = await request.json()

    // Валідація
    if (!template.name || template.dayOfWeek === undefined || !template.items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("schedule_templates")
      .insert({
        name: template.name,
        day_of_week: template.dayOfWeek,
        items: template.items,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating schedule template:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Template created successfully",
      data,
    })
  } catch (error) {
    console.error("Error in POST /api/admin/schedule/templates:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

