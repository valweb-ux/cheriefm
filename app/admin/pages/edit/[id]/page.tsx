import { PageForm } from "@/components/admin/pages/page-form"

interface EditPagePageProps {
  params: {
    id: string
  }
}

export default function EditPagePage({ params }: EditPagePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування сторінки</h1>
        <p className="text-muted-foreground">Внесіть зміни до сторінки</p>
      </div>

      <PageForm id={params.id} />
    </div>
  )
}

