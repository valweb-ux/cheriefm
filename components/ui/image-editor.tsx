"use client"

import * as React from "react"
import { Crop, RotateCw, ZoomIn, ZoomOut, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ImageEditorProps {
  imageUrl: string
  onSave: (blob: Blob) => Promise<void>
  className?: string
}

export function ImageEditor({ imageUrl, onSave, className }: ImageEditorProps) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [crop, setCrop] = React.useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isCropping, setIsCropping] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("zoom")

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const imageRef = React.useRef<HTMLImageElement | null>(null)

  // Завантаження зображення
  React.useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      imageRef.current = img

      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Встановлюємо розміри canvas
        canvas.width = img.width
        canvas.height = img.height

        // Встановлюємо початкові значення для кропу
        setCrop({
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        })

        // Малюємо зображення
        ctx?.drawImage(img, 0, 0, img.width, img.height)
      }
    }

    return () => {
      if (imageRef.current) {
        URL.revokeObjectURL(imageRef.current.src)
      }
    }
  }, [imageUrl])

  // Оновлення зображення при зміні параметрів
  React.useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    // Очищаємо canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Зберігаємо поточний стан контексту
    ctx.save()

    // Переміщуємо точку обертання в центр зображення
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Обертаємо
    ctx.rotate((rotation * Math.PI) / 180)

    // Масштабуємо
    ctx.scale(zoom, zoom)

    // Малюємо зображення з урахуванням кропу
    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      -crop.width / 2,
      -crop.height / 2,
      crop.width,
      crop.height,
    )

    // Відновлюємо попередній стан контексту
    ctx.restore()
  }, [zoom, rotation, crop])

  const handleSave = async () => {
    if (!canvasRef.current) return

    setIsSaving(true)

    try {
      const canvas = canvasRef.current

      // Конвертуємо canvas в Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          "image/jpeg",
          0.9,
        )
      })

      await onSave(blob)
    } catch (error) {
      console.error("Error saving image:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)

    if (imageRef.current) {
      setCrop({
        x: 0,
        y: 0,
        width: imageRef.current.width,
        height: imageRef.current.height,
      })
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden border rounded-lg">
        <canvas ref={canvasRef} className="max-w-full h-auto mx-auto" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="zoom">
            <ZoomIn className="h-4 w-4 mr-2" />
            Масштаб
          </TabsTrigger>
          <TabsTrigger value="rotate">
            <RotateCw className="h-4 w-4 mr-2" />
            Обертання
          </TabsTrigger>
          <TabsTrigger value="crop">
            <Crop className="h-4 w-4 mr-2" />
            Обрізка
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zoom" className="space-y-4">
          <div className="flex items-center space-x-2">
            <ZoomOut className="h-4 w-4" />
            <Slider value={[zoom]} min={0.5} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} />
            <ZoomIn className="h-4 w-4" />
          </div>
          <div className="text-center text-sm text-muted-foreground">Масштаб: {zoom.toFixed(1)}x</div>
        </TabsContent>

        <TabsContent value="rotate" className="space-y-4">
          <div className="flex items-center space-x-2">
            <RotateCw className="h-4 w-4" />
            <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={(value) => setRotation(value[0])} />
          </div>
          <div className="text-center text-sm text-muted-foreground">Обертання: {rotation}°</div>
        </TabsContent>

        <TabsContent value="crop" className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">Функція обрізки в розробці</div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Скинути
        </Button>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Збереження...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Зберегти
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

