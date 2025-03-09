import { ProgramForm } from "@/components/admin/programs/program-form"

interface EditProgramPageProps {
  params: {
    id: string
  }
}

export default function EditProgramPage({ params }: EditProgramPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування програми</h1>
        <p className="text-muted-foreground">Внесіть зміни до радіопрограми</p>
      </div>

      <ProgramForm id={params.id} />
    </div>
  )
}

