import { HostForm } from "@/components/admin/programs/host-form"

export default function CreateHostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Створення ведучого</h1>
        <p className="text-muted-foreground">Додайте нового ведучого радіостанції</p>
      </div>

      <HostForm />
    </div>
  )
}

