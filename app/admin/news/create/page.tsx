export const dynamic = "force-dynamic"

import { NewsForm } from "@/components/admin/news/news-form"

export default async function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Створити новину</h1>
      <NewsForm />
    </div>
  )
}

