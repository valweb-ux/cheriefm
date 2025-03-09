import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { PagesTable } from "@/components/admin/pages/pages-table"

export default function PagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Сторінки</h1>
          <p className="text-muted-foreground">Керуйте сторінками сайту</p>
        </div>
        <Link href="/admin/pages/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати сторінку
          </Button>
        </Link>
      </div>

      <PagesTable />
    </div>
  )
}

