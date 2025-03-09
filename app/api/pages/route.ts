export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для сторінок
  const pages = [
    {
      id: "1",
      title: "Про нас",
      slug: "about",
      content: "Зміст сторінки про нас",
    },
    {
      id: "2",
      title: "Контакти",
      slug: "contacts",
      content: "Зміст сторінки контактів",
    },
  ]

  return NextResponse.json(pages)
}

