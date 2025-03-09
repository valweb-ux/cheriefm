import { handleApiResponse } from "@/lib/utils/error-handler"
import { API_PATHS } from "@/lib/constants"

/**
 * Базова функція для виконання API запитів
 */
export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  return handleApiResponse(response)
}

/**
 * Отримання даних з API
 */
export async function getData<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  // Формуємо URL з параметрами
  const url = new URL(path, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value)
  })

  return fetchApi<T>(url.toString(), { method: "GET" })
}

/**
 * Створення даних через API
 */
export async function createData<T>(path: string, data: any): Promise<T> {
  return fetchApi<T>(path, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Оновлення даних через API
 */
export async function updateData<T>(path: string, id: string, data: any): Promise<T> {
  return fetchApi<T>(`${path}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * Видалення даних через API
 */
export async function deleteData<T>(path: string, id: string): Promise<T> {
  return fetchApi<T>(`${path}/${id}`, {
    method: "DELETE",
  })
}

/**
 * Хелпери для конкретних API
 */
export const newsApi = {
  getAll: (params: Record<string, string> = {}) => getData(API_PATHS.NEWS, params),
  getById: (id: string) => getData(`${API_PATHS.NEWS}/${id}`),
  create: (data: any) => createData(API_PATHS.NEWS, data),
  update: (id: string, data: any) => updateData(API_PATHS.NEWS, id, data),
  delete: (id: string) => deleteData(API_PATHS.NEWS, id),
}

export const programsApi = {
  getAll: (params: Record<string, string> = {}) => getData(API_PATHS.PROGRAMS, params),
  getById: (id: string) => getData(`${API_PATHS.PROGRAMS}/${id}`),
  create: (data: any) => createData(API_PATHS.PROGRAMS, data),
  update: (id: string, data: any) => updateData(API_PATHS.PROGRAMS, id, data),
  delete: (id: string) => deleteData(API_PATHS.PROGRAMS, id),
}

// Аналогічно можна створити хелпери для інших API

