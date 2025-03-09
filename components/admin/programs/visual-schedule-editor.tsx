import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VisualScheduleEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Візуальний редактор розкладу</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted">
          <p className="text-sm text-muted-foreground mb-4">Візуальний редактор розкладу тимчасово недоступний.</p>
          <Button>Додати програму</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisualScheduleEditor

