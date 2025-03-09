import { getRadioShowById, getRadioStreamUrl } from "@/lib/services/radio-service"
import { RadioPlayer } from "@/components/radio/radio-player"
import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface RadioShowPageProps {
  params: {
    id: string
  }
}

export default async function RadioShowPage({ params }: RadioShowPageProps) {
  try {
    const show = await getRadioShowById(params.id)
    const streamUrl = await getRadioStreamUrl()

    return (
      <div className="container py-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
            {show.imageUrl ? (
              <Image src={show.imageUrl || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Calendar className="text-muted-foreground" size={64} />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{show.title}</h1>

            {show.host && (
              <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <User size={18} />
                <span className="text-lg">Ведучий: {show.host}</span>
              </div>
            )}

            {show.schedule && show.schedule.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Розклад трансляцій:</h3>

                <div className="space-y-2">
                  {show.schedule.map((s, index) => (
                    <div key={index} className="flex flex-col p-3 border rounded-md">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>
                          {s.days
                            .map((day) => {
                              const days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
                              return days[day]
                            })
                            .join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Clock size={16} />
                        <span>
                          {s.startTime} - {s.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <RadioPlayer streamUrl={streamUrl} compact />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Про програму</h2>
          <div className="prose max-w-none">
            <p>{show.description}</p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching radio show:", error)
    notFound()
  }
}

