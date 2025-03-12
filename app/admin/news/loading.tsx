import { Loading } from "@/components/ui/loading"

export default function NewsLoading() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Всі новини</h1>
      <Loading />
    </div>
  )
}

