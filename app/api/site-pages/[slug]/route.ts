export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug

  // Статична заглушка для сторінки
  const page = {
    id: "1",
    title: "Сторінка " + slug,
    slug,
    content: "Зміст сторінки " + slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(page)
}

