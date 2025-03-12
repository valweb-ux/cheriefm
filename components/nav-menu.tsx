import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavMenu() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-primary-foreground/80 transition-colors">
          Новини
        </Link>
        <div className="space-x-4">
          <Button variant="secondary" asChild>
            <Link href="/">Головна</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin">Адмінпанель</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

