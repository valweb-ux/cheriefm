import { ScheduleCalendar } from "@/components/admin/programs/schedule-calendar"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Download, Edit } from "lucide-react"
import Link from "next/link"

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Розклад ефіру</h1>
          <p className="text-muted-foreground">Керуйте розкладом радіопрограм</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/schedule/visual">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Візуальний редактор
            </Button>
          </Link>
          <Link href="/admin/schedule/templates">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Шаблони
            </Button>
          </Link>
          <Link href="/admin/schedule/export">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Експорт
            </Button>
          </Link>
          <Link href="/admin/schedule/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Додати запис
            </Button>
          </Link>
        </div>
      </div>

      <ScheduleCalendar />
    </div>
  )
}

