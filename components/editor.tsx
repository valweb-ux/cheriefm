"use client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Створюємо заглушку для редактора TipTap
export default function Editor({ content = "", onChange = () => {}, placeholder = "Введіть текст..." }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-2 flex gap-2 border-b">
            <Button variant="ghost" size="sm">
              Ж
            </Button>
            <Button variant="ghost" size="sm">
              К
            </Button>
            <Button variant="ghost" size="sm">
              П
            </Button>
            <Button variant="ghost" size="sm">
              Посилання
            </Button>
            <Button variant="ghost" size="sm">
              Зображення
            </Button>
          </div>
          <Textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            className="border-0 focus-visible:ring-0 resize-none min-h-[200px]"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Повнофункціональний редактор тимчасово недоступний. Використовується спрощена версія.
        </p>
      </CardContent>
    </Card>
  )
}

