import { getRadioShows } from "@/lib/services/radio-service"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function RadioShowsPage() {
  const shows = await getRadioShows()

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Наші програми</h1>
        <p className="text-muted-foreground mt-2">Ознайомтеся з програмами, які ми транслюємо на Chérie FM</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shows.map((show) => (
          <Card key={show.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              {show.imageUrl ? (
                <Image src={show.imageUrl || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Calendar className="text-muted-foreground" size={48} />
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{show.title}</h2>

              {show.host && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <User size={16} />
                  <span>{show.host}</span>
                </div>
              )}

              {show.schedule && show.schedule.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {show.schedule
                        .map((s) => {
                          const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
                          return s.days.map((day) => days[day]).join(", ")
                        })
                        .join("; ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={16} />
                    <span>{show.schedule.map((s) => `${s.startTime} - ${s.endTime}`).join("; ")}</span>
                  </div>
                </div>
              )}

              <p className="mt-3 text-sm line-clamp-3">{show.description}</p>

              <div className="mt-4">
                <Link href={`/radio/shows/${show.id}`} className="text-primary hover:underline text-sm font-medium">
                  Детальніше
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

