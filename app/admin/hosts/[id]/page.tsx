import { HostForm } from "@/components/admin/programs/host-form"

interface EditHostPageProps {
  params: {
    id: string
  }
}

export default function EditHostPage({ params }: EditHostPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування ведучого</h1>
        <p className="text-muted-foreground">Внесіть зміни до інформації про ведучого</p>
      </div>

      <HostForm id={params.id} />
    </div>
  )
}

