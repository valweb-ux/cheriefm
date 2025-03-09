import { NewsForm } from "@/components/admin/news/news-form"

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Створення новини</h1>
        <p className="text-muted-foreground">Додайте нову новину на сайт</p>
      </div>

      <NewsForm />
    </div>
  )
}

