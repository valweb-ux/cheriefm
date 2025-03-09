import { Suspense } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import AdminLoading from "@/components/admin/admin-loading"
import ChartForm from "@/components/admin/music/chart-form"
import { getChartById } from "@/lib/services/charts-service"

export const metadata = {
  title: "Редагування чарту | Адмін-панель",
}

export default async function EditChartPage({ params }: { params: { id: string } }) {
  const chart = await getChartById(params.id)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/music/charts">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад до списку
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Редагування чарту</h1>
      </div>

      <Suspense fallback={<AdminLoading />}>
        <ChartForm chart={chart} />
      </Suspense>
    </div>
  )
}

