import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"
import { getProgramById } from "@/lib/services/programs-service"
import { notFound } from "next/navigation"
import { ProgramDetails } from "@/components/admin/programs/program-details"
import { EpisodesTable } from "@/components/admin/episodes/episodes-table"

interface ProgramPageProps {
  params: {
    id: string
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  try {
    const program = await getProgramById(params.id)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{program.title_uk}</h1>
            <p className="text-muted-foreground">Деталі програми та епізоди</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/programs">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад до списку
              </Button>
            </Link>
            <Link href={`/admin/episodes/create?program=${program.id}`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Додати епізод
              </Button>
            </Link>
          </div>
        </div>

        <ProgramDetails program={program} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Епізоди програми</h2>
          <EpisodesTable programId={program.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching program:", error)
    return notFound()
  }
}

