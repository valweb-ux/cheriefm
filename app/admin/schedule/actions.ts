"use server"

import { revalidatePath } from "next/cache"
import {
  createScheduleEntry,
  deleteScheduleEntry,
  updateScheduleEntry,
  generateRecurringSchedule,
} from "@/lib/services/schedule-service"
import type { ScheduleEntryInsert, ScheduleEntryUpdate } from "@/types/programs.types"
import { getCurrentUser } from "@/lib/auth"

export async function createScheduleEntryAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const program_id = formData.get("program_id") as string
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const is_recurring = formData.get("is_recurring") === "on"
    const recurrence_rule = (formData.get("recurrence_rule") as string) || null
    const hosts = formData.getAll("hosts") as string[]
    const notes = (formData.get("notes") as string) || null
    const is_special = formData.get("is_special") === "on"
    const override_title = (formData.get("override_title") as string) || null
    const status = formData.get("status") as "scheduled" | "live" | "completed" | "cancelled"

    // Валідація обов'язкових полів
    if (!program_id || !start_time || !end_time) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Перевіряємо, що кінцевий час пізніше початкового
    if (new Date(end_time) <= new Date(start_time)) {
      return { success: false, message: "Кінцевий час має бути пізніше початкового" }
    }

    // Якщо це повторюваний запис, генеруємо всі записи
    if (is_recurring && recurrence_rule) {
      const duration = (new Date(end_time).getTime() - new Date(start_time).getTime()) / 60000 // тривалість у хвилинах

      // Генеруємо повторювані записи
      const entries = await generateRecurringSchedule(program_id, start_time, end_time, recurrence_rule, duration)

      // Оновлюємо кеш сторінки
      revalidatePath("/admin/schedule")

      return {
        success: true,
        message: `Створено ${entries.length} записів розкладу`,
        id: entries[0].id,
      }
    } else {
      // Створюємо один запис розкладу
      const scheduleData: ScheduleEntryInsert = {
        program_id,
        start_time,
        end_time,
        is_recurring: false,
        recurrence_rule: null,
        hosts: hosts.length > 0 ? hosts : null,
        notes,
        is_special,
        override_title,
        status,
      }

      // Створюємо запис розкладу
      const entry = await createScheduleEntry(scheduleData)

      // Оновлюємо кеш сторінки
      revalidatePath("/admin/schedule")

      return {
        success: true,
        message: "Запис розкладу успішно створено",
        id: entry.id,
      }
    }
  } catch (error) {
    console.error("Error creating schedule entry:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при створенні запису розкладу",
    }
  }
}

export async function updateScheduleEntryAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Отримуємо дані з форми
    const program_id = formData.get("program_id") as string
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const hosts = formData.getAll("hosts") as string[]
    const notes = (formData.get("notes") as string) || null
    const is_special = formData.get("is_special") === "on"
    const override_title = (formData.get("override_title") as string) || null
    const status = formData.get("status") as "scheduled" | "live" | "completed" | "cancelled"

    // Валідація обов'язкових полів
    if (!program_id || !start_time || !end_time) {
      return { success: false, message: "Заповніть всі обов'язкові поля" }
    }

    // Перевіряємо, що кінцевий час пізніше початкового
    if (new Date(end_time) <= new Date(start_time)) {
      return { success: false, message: "Кінцевий час має бути пізніше початкового" }
    }

    // Створюємо об'єкт запису розкладу
    const scheduleData: ScheduleEntryUpdate = {
      program_id,
      start_time,
      end_time,
      hosts: hosts.length > 0 ? hosts : null,
      notes,
      is_special,
      override_title,
      status,
    }

    // Оновлюємо запис розкладу
    await updateScheduleEntry(id, scheduleData)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/schedule")
    revalidatePath(`/admin/schedule/${id}`)

    return {
      success: true,
      message: "Запис розкладу успішно оновлено",
    }
  } catch (error) {
    console.error("Error updating schedule entry:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при оновленні запису розкладу",
    }
  }
}

export async function deleteScheduleEntryAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Видаляємо запис розкладу
    await deleteScheduleEntry(id)

    // Оновлюємо кеш сторінки
    revalidatePath("/admin/schedule")

    return {
      success: true,
      message: "Запис розкладу успішно видалено",
    }
  } catch (error) {
    console.error("Error deleting schedule entry:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при видаленні запису розкладу",
    }
  }
}

export async function exportScheduleToICalAction(
  startDate: string,
  endDate: string,
): Promise<{ success: boolean; message: string; data?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Імпортуємо сервіс для експорту розкладу
    const { exportScheduleToICalendar } = await import("@/lib/services/schedule-service")

    // Експортуємо розклад
    const iCalData = await exportScheduleToICalendar(startDate, endDate)

    return {
      success: true,
      message: "Розклад успішно експортовано",
      data: iCalData,
    }
  } catch (error) {
    console.error("Error exporting schedule to iCal:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при експорті розкладу",
    }
  }
}

export async function exportScheduleToGoogleCalAction(
  startDate: string,
  endDate: string,
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "Ви не авторизовані" }
    }

    // Імпортуємо сервіс для експорту розкладу
    const { exportScheduleToGoogleCalendar } = await import("@/lib/services/schedule-service")

    // Експортуємо розклад
    const googleCalUrl = await exportScheduleToGoogleCalendar(startDate, endDate)

    return {
      success: true,
      message: "Розклад успішно експортовано",
      url: googleCalUrl,
    }
  } catch (error) {
    console.error("Error exporting schedule to Google Calendar:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Помилка при експорті розкладу",
    }
  }
}

