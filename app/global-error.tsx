"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Критична помилка</h2>
            <p className="mb-6">Виникла критична помилка при завантаженні додатку.</p>
            {process.env.NODE_ENV === "development" && (
              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-sm mb-6">
                <p className="font-mono">{error.message}</p>
              </div>
            )}
            <Button onClick={reset} className="w-full">
              Спробувати знову
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

