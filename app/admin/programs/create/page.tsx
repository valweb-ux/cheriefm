import { ProgramForm } from "@/components/admin/programs/program-form"

export default function CreateProgramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Створення програми</h1>
        <p className="text-muted-foreground">Додайте нову радіопрограму</p>
      </div>

      <ProgramForm />
    </div>
  )
}

