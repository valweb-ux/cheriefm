"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  isUploading?: boolean
}

export function FileUpload({
  onUpload,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept,
  isUploading = false,
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles[0].errors
        if (errors[0]?.code === "file-too-large") {
          setError(`Файл занадто великий. Максимальний розмір: ${maxSize / (1024 * 1024)}MB`)
        } else if (errors[0]?.code === "file-invalid-type") {
          setError("Непідтримуваний тип файлу")
        } else {
          setError("Помилка при завантаженні файлу")
        }
        return
      }

      if (acceptedFiles.length > maxFiles) {
        setError(`Ви можете завантажити максимум ${maxFiles} файл(ів) одночасно`)
        return
      }

      setFiles(acceptedFiles)
    },
    [maxFiles, maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  })

  const handleUpload = async () => {
    if (files.length === 0) return

    try {
      await onUpload(files)
      setFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка при завантаженні файлу")
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          error && "border-destructive",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Перетягніть файли сюди або клікніть, щоб вибрати</p>
          <p className="text-xs text-muted-foreground">Максимальний розмір: {maxSize / (1024 * 1024)}MB</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Вибрані файли:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>

          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Завантаження...
              </>
            ) : (
              "Завантажити"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

