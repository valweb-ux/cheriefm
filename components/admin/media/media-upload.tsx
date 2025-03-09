"use client"
import { Button } from "@/components/ui/button"

export function MediaUpload({ onUpload = () => {} }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground mb-4">Перетягніть файли сюди або клікніть для вибору</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.multiple = true
              input.accept = "image/*,audio/*,video/*"
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files
                if (files && files.length > 0) {
                  onUpload(Array.from(files))
                }
              }
              input.click()
            }}
          >
            Вибрати файли
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MediaUpload

