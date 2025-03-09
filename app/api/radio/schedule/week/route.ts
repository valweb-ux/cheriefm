export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для розкладу на тиждень
  const weekSchedule = {
    monday: [
      {
        id: "1",
        title: "Ранкове шоу",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        id: "2",
        title: "Музичний блок",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    tuesday: [
      {
        id: "1",
        title: "Ранкове шоу",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        id: "2",
        title: "Музичний блок",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    wednesday: [
      {
        id: "1",
        title: "Ранкове шоу",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        id: "2",
        title: "Музичний блок",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    thursday: [
      {
        id: "1",
        title: "Ранкове шоу",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        id: "2",
        title: "Музичний блок",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    friday: [
      {
        id: "1",
        title: "Ранкове шоу",
        startTime: "08:00",
        endTime: "10:00",
      },
      {
        id: "2",
        title: "Музичний блок",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    saturday: [
      {
        id: "3",
        title: "Вихідний блок",
        startTime: "10:00",
        endTime: "14:00",
      },
    ],
    sunday: [
      {
        id: "3",
        title: "Вихідний блок",
        startTime: "10:00",
        endTime: "14:00",
      },
    ],
  }

  return NextResponse.json(weekSchedule)
}

