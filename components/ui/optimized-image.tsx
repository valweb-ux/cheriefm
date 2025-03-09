"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "100vw",
  fill = false,
  quality = 80,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
    setLoading(true)
    setError(false)
  }, [src])

  // Використовуємо placeholder для зображень, які не завантажилися
  const handleError = () => {
    setError(true)
    setLoading(false)
    setImageSrc(`/placeholder.svg?height=${height || 300}&width=${width || 300}`)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  return (
    <div className={`relative ${className}`} style={{ height: fill ? "100%" : "auto" }}>
      {loading && (
        <Skeleton
          className="absolute inset-0 z-10"
          style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
        />
      )}

      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={quality}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        style={{ objectFit }}
      />
    </div>
  )
}

