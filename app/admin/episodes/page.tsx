import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { EpisodesTable } from "@/components/admin/episodes/episodes-table"

export default function EpisodesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Епізоди програм</h1>
          <p className="text-muted-foreground">Керуйте епізодами радіопрограм</p>
        </div>
        <Link href="/admin/episodes/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати епізод
          </Button>
        </Link>
      </div>

      <EpisodesTable />
    </div>
  )
}

