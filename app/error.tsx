"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Щось пішло не так</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Виникла помилка при завантаженні сторінки.</p>
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-sm">
              <p className="font-mono">{error.message}</p>
              {error.stack && <pre className="mt-2 text-xs text-gray-600">{error.stack}</pre>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Спробувати знову
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

