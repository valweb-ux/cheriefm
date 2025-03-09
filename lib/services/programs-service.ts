import { createClient } from "@/lib/supabase/server"
import type { Program, ProgramInsert, ProgramUpdate } from "@/types/programs.types"

export async function getPrograms(
  page = 1,
  limit = 10,
  search = "",
  filter = "",
): Promise<{ data: Program[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase
    .from("programs")
    .select("*", { count: "exact" })
    .order("air_time", { ascending: true })
    .range(from, to)

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`title_uk.ilike.%${search}%,description_uk.ilike.%${search}%`)
  }

  // Додаємо фільтр за днем тижня, якщо він є
  if (filter) {
    query = query.eq("day_of_week", filter)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching programs:", error)
    throw new Error(`Помилка при отриманні програм: ${error.message}`)
  }

  return {
    data: data as Program[],
    count: count || 0,
  }
}

export async function getProgramById(id: string): Promise<Program> {
  const supabase = createClient()

  const { data, error } = await supabase.from("programs").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching program by ID:", error)
    throw new Error(`Помилка при отриманні програми: ${error.message}`)
  }

  return data as Program
}

export async function createProgram(program: ProgramInsert): Promise<Program> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const programWithDates = {
    ...program,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("programs").insert(programWithDates).select().single()

  if (error) {
    console.error("Error creating program:", error)
    throw new Error(`Помилка при створенні програми: ${error.message}`)
  }

  return data as Program
}

export async function updateProgram(id: string, program: ProgramUpdate): Promise<Program> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const programWithDate = {
    ...program,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("programs").update(programWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating program:", error)
    throw new Error(`Помилка при оновленні програми: ${error.message}`)
  }

  return data as Program
}

export async function deleteProgram(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("programs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting program:", error)
    throw new Error(`Помилка при видаленні програми: ${error.message}`)
  }
}

export async function getProgramHosts(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("programs").select("host").order("host")

  if (error) {
    console.error("Error fetching program hosts:", error)
    throw new Error(`Помилка при отриманні ведучих: ${error.message}`)
  }

  // Отримуємо унікальних ведучих
  const hosts = [...new Set(data.map((item) => item.host).filter(Boolean))]

  return hosts
}

