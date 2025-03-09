import { NewsForm } from "@/components/admin/news/news-form"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Редагування новини</h1>
        <p className="text-muted-foreground">Внесіть зміни до новини</p>
      </div>

      <NewsForm id={params.id} />
    </div>
  )
}

