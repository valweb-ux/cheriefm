import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl mb-8">Сторінку не знайдено</p>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Сторінка, яку ви шукаєте, не існує або була переміщена.
      </p>
      <Button asChild>
        <Link href="/">Повернутися на головну</Link>
      </Button>
    </div>
  )
}

