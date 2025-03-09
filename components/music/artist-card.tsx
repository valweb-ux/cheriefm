import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ArtistCardProps {
  id: string
  name: string
  image_url?: string
  slug?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ArtistCard({ id, name, image_url, slug, className, size = "md" }: ArtistCardProps) {
  const href = slug ? `/music/artists/${slug}` : `/music/artists/${id}`

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  }

  return (
    <Card className={cn("overflow-hidden border-none shadow-none bg-transparent", className)}>
      <CardContent className="p-2 flex flex-col items-center">
        <Link href={href} className="block">
          <div className={cn("relative rounded-full overflow-hidden mb-2 mx-auto", sizeClasses[size])}>
            {image_url ? (
              <Image src={image_url || "/placeholder.svg"} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">{name.charAt(0)}</span>
              </div>
            )}
          </div>
        </Link>

        <Link href={href} className="text-center hover:underline">
          <h3 className="font-medium text-sm truncate max-w-full">{name}</h3>
        </Link>
      </CardContent>
    </Card>
  )
}

