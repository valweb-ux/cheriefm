import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ProgramsTable } from "@/components/admin/programs/programs-table"

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Радіопрограми</h1>
          <p className="text-muted-foreground">Керуйте програмами радіостанції</p>
        </div>
        <Link href="/admin/programs/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати програму
          </Button>
        </Link>
      </div>

      <ProgramsTable />
    </div>
  )
}

