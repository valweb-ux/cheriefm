"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Експортуємо компонент за замовчуванням
export default function ProgramDetails({ program = {}, onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{program.title || "Деталі програми"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(program.id)}>
            Редагувати
          </Button>
          <Button variant="destructive" onClick={() => onDelete(program.id)}>
            Видалити
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Інформація про програму</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Назва</h3>
              <p>{program.title || "Не вказано"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Опис</h3>
              <p>{program.description || "Не вказано"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Ведучий</h3>
              <p>{program.host || "Не вказано"}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Тривалість</h3>
              <p>{program.duration ? `${program.duration} хв.` : "Не вказано"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Розклад</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Інформація про розклад тимчасово недоступна.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Також експортуємо іменований компонент для сумісності
export { ProgramDetails }

