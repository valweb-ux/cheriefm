import { ScheduleTemplateManager } from "@/components/admin/programs/schedule-template-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScheduleTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Шаблони розкладу</h1>
          <p className="text-muted-foreground">Керуйте шаблонами для швидкого створення розкладу</p>
        </div>
        <Link href="/admin/schedule">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до розкладу
          </Button>
        </Link>
      </div>

      <ScheduleTemplateManager />
    </div>
  )
}

