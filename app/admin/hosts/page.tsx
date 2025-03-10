import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { HostsList } from "@/components/admin/programs/hosts-list"

export default function HostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ведучі</h1>
          <p className="text-muted-foreground">Керуйте ведучими радіостанції</p>
        </div>
        <Link href="/admin/hosts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Додати ведучого
          </Button>
        </Link>
      </div>

      <HostsList />
    </div>
  )
}

