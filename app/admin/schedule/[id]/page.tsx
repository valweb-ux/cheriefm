import { ScheduleEntryForm } from "@/components/admin/programs/schedule-entry-form"

interface EditScheduleEntryPageProps {
  params: {
    id: string
  }
}

export default function EditScheduleEntryPage({ params }: EditScheduleEntryPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування запису розкладу</h1>
        <p className="text-muted-foreground">Внесіть зміни до запису розкладу ефіру</p>
      </div>

      <ScheduleEntryForm id={params.id} />
    </div>
  )
}

