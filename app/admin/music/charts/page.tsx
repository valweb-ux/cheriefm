import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import AdminLoading from "@/components/admin/admin-loading"
import ChartsList from "@/components/admin/music/charts-list"

export const metadata = {
  title: "Управління чартами | Адмін-панель",
}

export default function ChartsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управління чартами</h1>
        <Button asChild>
          <Link href="/admin/music/charts/new">
            <Plus className="mr-2 h-4 w-4" />
            Створити чарт
          </Link>
        </Button>
      </div>

      <Suspense fallback={<AdminLoading />}>
        <ChartsList />
      </Suspense>
    </div>
  )
}

