import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    // Створюємо початок і кінець дня
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const supabase = createClient()

    // Отримуємо записи розкладу для вказаного дня
    const { data, error } = await supabase
      .from("schedule_entries")
      .select(`
        *,
        program:program_id (
          title_uk,
          color
        )
      `)
      .gte("start_time", startOfDay.toISOString())
      .lte("start_time", endOfDay.toISOString())
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching schedule for day:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Форматуємо дані для відповіді
    const formattedData = data.map((item) => ({
      id: item.id,
      program_id: item.program_id,
      program_title: item.program?.title_uk,
      start_time: item.start_time,
      end_time: item.end_time,
      is_special: item.is_special,
      override_title: item.override_title,
      hosts: item.hosts,
      status: item.status,
      color: item.program?.color,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error in GET /api/admin/schedule/day:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scheduleItems = await request.json()

    if (!Array.isArray(scheduleItems)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    const supabase = createClient()

    // Отримуємо дату з першого елемента розкладу
    if (scheduleItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items to save",
      })
    }

    const date = new Date(scheduleItems[0].start_time)
    date.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Видаляємо всі існуючі записи для цього дня
    const { error: deleteError } = await supabase
      .from("schedule_entries")
      .delete()
      .gte("start_time", date.toISOString())
      .lte("start_time", endOfDay.toISOString())

    if (deleteError) {
      console.error("Error deleting existing schedule entries:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Створюємо нові записи
    const newEntries = scheduleItems.map((item) => ({
      program_id: item.program_id,
      start_time: item.start_time,
      end_time: item.end_time,
      is_recurring: false,
      recurrence_rule: null,
      hosts: item.hosts || [],
      notes: null,
      is_special: item.is_special,
      override_title: item.override_title,
      status: item.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase.from("schedule_entries").insert(newEntries).select()

    if (error) {
      console.error("Error creating schedule entries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Schedule saved successfully",
      data,
    })
  } catch (error) {
    console.error("Error in POST /api/admin/schedule/day:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

