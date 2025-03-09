import { Suspense } from "react"
import { RadioSchedule } from "@/components/radio/radio-schedule"

export default function RadioSchedulePage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Розклад ефіру</h1>
        <p className="text-muted-foreground mt-2">Ознайомтеся з розкладом програм на Chérie FM</p>
      </div>

      <div className="mt-6">
        <Suspense fallback={<div>Завантаження розкладу...</div>}>
          <RadioSchedule className="max-w-4xl mx-auto" />
        </Suspense>
      </div>
    </div>
  )
}

