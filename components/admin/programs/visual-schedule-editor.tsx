"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Створюємо заглушку для компонента, який використовує @dnd-kit
export default function VisualScheduleEditor({ schedule = [], onSave = () => {} }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Візуальний редактор розкладу</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted">
          <p className="text-sm text-muted-foreground mb-4">Візуальний редактор розкладу тимчасово недоступний.</p>
          <Button onClick={() => onSave(schedule)}>Зберегти розклад</Button>
        </div>
      </CardContent>
    </Card>
  )
}

