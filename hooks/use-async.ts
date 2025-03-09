"use client"

import { useState, useCallback } from "react"
import { handleError } from "@/lib/utils/error-handler"

/**
 * Хук для обробки асинхронних операцій
 * @param asyncFunction - Асинхронна функція
 * @param immediate - Чи викликати функцію одразу
 * @returns Об'єкт з функцією execute, станами loading, error, value
 */
export function useAsync<T, P extends any[]>(asyncFunction: (...args: P) => Promise<T>, immediate = false) {
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Функція для виконання асинхронної операції
  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true)
        setError(null)

        const result = await asyncFunction(...args)
        setValue(result)
        return result
      } catch (e) {
        const errorMessage = handleError(e, undefined, false)
        setError(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction],
  )

  // Викликаємо функцію одразу, якщо потрібно
  useState(() => {
    if (immediate) {
      execute([] as unknown as P)
    }
  })

  return { execute, loading, error, value }
}

