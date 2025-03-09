import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { NewsTable } from "@/components/admin/news/news-table"

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Новини</h1>
          <p className="text-muted-foreground">Керуйте новинами на сайті</p>
        </div>
        <Link href="/admin/news/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати новину
          </Button>
        </Link>
      </div>

      <NewsTable />
    </div>
  )
}

