"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ImageUpload({ value = "", onChange = () => {}, label = "Завантажити зображення" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          {value ? (
            <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={value || "/placeholder.svg"}
                alt="Завантажене зображення"
                className="object-cover w-full h-full"
              />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => onChange("")}>
                Видалити
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground rounded-md p-8 w-full text-center">
              <p className="text-sm text-muted-foreground mb-2">Перетягніть зображення сюди або клікніть для вибору</p>
              <Button variant="outline">{label}</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

