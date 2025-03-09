export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для шаблону розкладу
  const template = {
    id,
    name: "Шаблон " + id,
    description: "Опис шаблону " + id,
    items: [
      {
        id: "1",
        title: "Ранкове шоу",
        start: "08:00",
        end: "10:00",
        programId: "1",
        day: "monday",
      },
      {
        id: "2",
        title: "Музичний блок",
        start: "10:00",
        end: "12:00",
        programId: "2",
        day: "monday",
      },
    ],
  }

  return NextResponse.json(template)
}

export async function PUT() {
  // Статична заглушка для оновлення шаблону розкладу
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  // Статична заглушка для видалення шаблону розкладу
  return NextResponse.json({ success: true })
}

