"use client"
import { Button } from "@/components/ui/button"

export function ImageUpload({ onUpload = () => {}, value = "", onChange = () => {} }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {value ? (
          <div className="relative">
            <img src={value || "/placeholder.svg"} alt="Uploaded image" className="mx-auto max-h-48 object-contain" />
            <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => onChange("")}>
              Видалити
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Перетягніть зображення сюди або клікніть для вибору</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    onUpload(file)
                  }
                }
                input.click()
              }}
            >
              Вибрати зображення
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload

