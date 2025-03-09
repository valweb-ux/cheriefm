import { NextResponse } from "next/server"
import { getNextAdvertToPlay, getUserTargetingDataFromRequest } from "@/lib/services/radio-adverts-service"
import { handleError } from "@/lib/utils/error-handler"
import { ERROR_MESSAGES } from "@/lib/constants"

export async function GET(request: Request) {
  try {
    // Отримуємо дані для таргетування з запиту
    const userData = getUserTargetingDataFromRequest(request)

    // Додаємо додаткові параметри з URL
    const url = new URL(request.url)
    const programId = url.searchParams.get("programId")
    if (programId) {
      userData.listeningProgram = programId
    }

    // Отримуємо відповідний рекламний ролик
    const advert = await getNextAdvertToPlay(userData)

    if (!advert) {
      return NextResponse.json({ success: false, message: "No matching adverts found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      advert: {
        id: advert.id,
        title: advert.title,
        audioUrl: advert.audioUrl,
        duration: advert.duration,
      },
    })
  } catch (error) {
    const errorMessage = handleError(error, ERROR_MESSAGES.SERVER_ERROR, false)
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}

