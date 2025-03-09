import { createClient } from "@/lib/supabase/server"
import type { Host, HostInsert, HostUpdate } from "@/types/programs.types"

export async function getHosts(page = 1, limit = 10, search = ""): Promise<{ data: Host[]; count: number }> {
  const supabase = createClient()

  // Розрахунок відступу для пагінації
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Базовий запит
  let query = supabase.from("hosts").select("*", { count: "exact" }).order("name", { ascending: true }).range(from, to)

  // Додаємо фільтр пошуку, якщо він є
  if (search) {
    query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching hosts:", error)
    throw new Error(`Помилка при отриманні ведучих: ${error.message}`)
  }

  return {
    data: data as Host[],
    count: count || 0,
  }
}

export async function getHostById(id: string): Promise<Host> {
  const supabase = createClient()

  const { data, error } = await supabase.from("hosts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching host by ID:", error)
    throw new Error(`Помилка при отриманні ведучого: ${error.message}`)
  }

  return data as Host
}

export async function createHost(host: HostInsert): Promise<Host> {
  const supabase = createClient()

  // Додаємо поточну дату до created_at та updated_at
  const hostWithDates = {
    ...host,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("hosts").insert(hostWithDates).select().single()

  if (error) {
    console.error("Error creating host:", error)
    throw new Error(`Помилка при створенні ведучого: ${error.message}`)
  }

  return data as Host
}

export async function updateHost(id: string, host: HostUpdate): Promise<Host> {
  const supabase = createClient()

  // Додаємо поточну дату до updated_at
  const hostWithDate = {
    ...host,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("hosts").update(hostWithDate).eq("id", id).select().single()

  if (error) {
    console.error("Error updating host:", error)
    throw new Error(`Помилка при оновленні ведучого: ${error.message}`)
  }

  return data as Host
}

export async function deleteHost(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("hosts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting host:", error)
    throw new Error(`Помилка при видаленні ведучого: ${error.message}`)
  }
}

export async function getHostsByProgramId(programId: string): Promise<Host[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("hosts")
    .select("*")
    .contains("programs", [programId])
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching hosts by program ID:", error)
    throw new Error(`Помилка при отриманні ведучих програми: ${error.message}`)
  }

  return data as Host[]
}

export async function assignHostToProgram(hostId: string, programId: string): Promise<void> {
  const supabase = createClient()

  // Отримуємо поточні дані ведучого
  const { data: host, error: fetchError } = await supabase.from("hosts").select("programs").eq("id", hostId).single()

  if (fetchError) {
    console.error("Error fetching host:", fetchError)
    throw new Error(`Помилка при отриманні ведучого: ${fetchError.message}`)
  }

  // Оновлюємо список програм ведучого
  const programs = host.programs || []
  if (!programs.includes(programId)) {
    programs.push(programId)
  }

  const { error: updateError } = await supabase
    .from("hosts")
    .update({
      programs,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hostId)

  if (updateError) {
    console.error("Error assigning host to program:", updateError)
    throw new Error(`Помилка при призначенні ведучого до програми: ${updateError.message}`)
  }
}

export async function removeHostFromProgram(hostId: string, programId: string): Promise<void> {
  const supabase = createClient()

  // Отримуємо поточні дані ведучого
  const { data: host, error: fetchError } = await supabase.from("hosts").select("programs").eq("id", hostId).single()

  if (fetchError) {
    console.error("Error fetching host:", fetchError)
    throw new Error(`Помилка при отриманні ведучого: ${fetchError.message}`)
  }

  // Оновлюємо список програм ведучого
  const programs = (host.programs || []).filter((id) => id !== programId)

  const { error: updateError } = await supabase
    .from("hosts")
    .update({
      programs,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hostId)

  if (updateError) {
    console.error("Error removing host from program:", updateError)
    throw new Error(`Помилка при видаленні ведучого з програми: ${updateError.message}`)
  }
}

