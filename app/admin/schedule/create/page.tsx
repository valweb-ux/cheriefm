import { ScheduleEntryForm } from "@/components/admin/programs/schedule-entry-form"

export default function CreateScheduleEntryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Створення запису розкладу</h1>
        <p className="text-muted-foreground">Додайте новий запис до розкладу ефіру</p>
      </div>

      <ScheduleEntryForm />
    </div>
  )
}

