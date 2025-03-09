import { Suspense } from "react"
import { getRadioStreamUrl } from "@/lib/services/radio-service"
import { RadioPlayer } from "@/components/radio/radio-player"
import { RadioSchedule } from "@/components/radio/radio-schedule"
import { RadioShowsList } from "@/components/radio/radio-shows-list"
import { NowPlayingBanner } from "@/components/radio/now-playing-banner"

export default async function RadioPage() {
  const streamUrl = await getRadioStreamUrl()

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Радіо Chérie FM</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <RadioPlayer streamUrl={streamUrl} />
        </div>

        <div>
          <NowPlayingBanner
            onPlayClick={() => {
              // Клієнтський код для запуску плеєра буде реалізовано через useEffect
              const radioPlayerButton = document.querySelector(".radio-player-button") as HTMLButtonElement
              if (radioPlayerButton) radioPlayerButton.click()
            }}
          />

          <div className="mt-6">
            <Suspense fallback={<div>Завантаження розкладу...</div>}>
              <RadioSchedule />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div>Завантаження програм...</div>}>
          <RadioShowsList />
        </Suspense>
      </div>
    </div>
  )
}

