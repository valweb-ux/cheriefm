export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Статична заглушка для конкурсу
  const contest = {
    id,
    title: "Конкурс " + id,
    description: "Опис конкурсу " + id,
    prize: "Приз",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    rules: "Правила конкурсу...",
    entries: [
      {
        id: "1",
        name: "Учасник 1",
        email: "participant1@example.com",
        submittedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Учасник 2",
        email: "participant2@example.com",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }

  return NextResponse.json(contest)
}

