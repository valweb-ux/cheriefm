import { createClient } from "@/lib/supabase/server"
import type { ScheduleEntry, ScheduleEntryInsert, ScheduleEntryUpdate } from "@/types/programs.types"

export async function getScheduleEntries(startDate: string, endDate: string): Promise<ScheduleEntry[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("schedule_entries")
    .select("*")
    .or(`start_time.gte.${startDate},end_time.lte.${endDate}`)
    .order("start_time", { ascending: true })

  if (error) {
    console.error("Error fetching schedule entries:", error)
    throw new Error(`Помилка при отриманні розкладу: ${error.message}`)
  }

  return data as ScheduleEntry[]
}

export async function getScheduleEntriesByProgramId(
  programId: string,
  startDate?: string,
  endDate?: string,
): Promise<ScheduleEntry[]> {
  const supabase = createClient()

  let query = supabase
    .from("schedule_entries")
    .select("*")
    .eq("program_id", programId)
    .order("start_time", { ascending: true })

  if (startDate && endDate) {
    query = query.or(`start_time.gte.${startDate},end_time.lte.${endDate}`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching schedule entries by program ID:", error)
    throw new Error(`Помилка при отриманні розкладу програми: ${error.message}`)
  }

  return data as ScheduleEntry[]
}

export async function getScheduleEntryById(id: string): Promise<ScheduleEntry> {
  const supabase = createClient()

  const { data, error } = await supabase.from("schedule_entries").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching schedule entry by ID:", error)
    throw new Error(`Помилка при отриманні запису розкладу: ${error.message}`)
  }

  return data as ScheduleEntry
}

export async function createScheduleEntry(entry: ScheduleEntryInsert): Promise<ScheduleEntry> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const entryWithDates = {
    ...entry,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("schedule_entries").insert(entryWithDates).select().single()

  if (error) {
    console.error("Error creating schedule entry:", error)
    throw new Error(`Помилка при створенні запису розкладу: ${error.message}`)
  }

  return data as ScheduleEntry
}

export async function updateScheduleEntry(id: string, entry: ScheduleEntryUpdate): Promise<ScheduleEntry> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const entryWithDate = {
    ...entry,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("schedule_entries").update(entryWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating schedule entry:", error)
    throw new Error(`Помилка при оновленні запису розкладу: ${error.message}`)
  }

  return data as ScheduleEntry
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("schedule_entries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting schedule entry:", error)
    throw new Error(`Помилка при видаленні запису розкладу: ${error.message}`)
  }
}

export async function generateRecurringSchedule(
  programId: string,
  startDate: string,
  endDate: string,
  recurrenceRule: string,
  duration: number,
): Promise<ScheduleEntry[]> {
  // Тут буде логіка для генерації повторюваних записів розкладу
  // на основі правила повторення (recurrenceRule у форматі iCal RRULE)

  // Для прикладу, просто створюємо один запис
  const entry: ScheduleEntryInsert = {
    program_id: programId,
    start_time: startDate,
    end_time: new Date(new Date(startDate).getTime() + duration * 60000).toISOString(),
    is_recurring: true,
    recurrence_rule: recurrenceRule,
    hosts: null,
    notes: null,
    is_special: false,
    override_title: null,
    status: "scheduled",
  }

  const createdEntry = await createScheduleEntry(entry)

  return [createdEntry]
}

export async function exportScheduleToICalendar(startDate: string, endDate: string): Promise<string> {
  const entries = await getScheduleEntries(startDate, endDate)

  // Тут буде логіка для генерації iCalendar файлу
  // Повертаємо iCalendar дані у форматі рядка

  let iCalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cherie FM//Radio Schedule//UK
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Cherie FM Radio Schedule
X-WR-TIMEZONE:Europe/Kiev
BEGIN:VTIMEZONE
TZID:Europe/Kiev
X-LIC-LOCATION:Europe/Kiev
END:VTIMEZONE
`

  for (const entry of entries) {
    const startTime = new Date(entry.start_time)
    const endTime = new Date(entry.end_time)

    iCalData += `BEGIN:VEVENT
UID:${entry.id}@cheriefm.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${entry.override_title || "Radio Program"}
STATUS:${entry.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}
END:VEVENT
`
  }

  iCalData += "END:VCALENDAR"

  return iCalData
}

export async function exportScheduleToGoogleCalendar(startDate: string, endDate: string): Promise<string> {
  // Тут буде логіка для генерації URL для Google Calendar
  // Повертаємо URL для додавання в Google Calendar

  const entries = await getScheduleEntries(startDate, endDate)

  // Для прикладу, просто повертаємо базовий URL
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cherie FM Schedule&dates=${startDate}/${endDate}`
}

