export const dynamic = "force-static"

import { NextResponse } from "next/server"

export async function GET() {
  // Статична заглушка для аналітики
  const analytics = {
    totalVisits: 10000,
    uniqueVisitors: 5000,
    pageViews: {
      "/": 5000,
      "/news": 3000,
      "/radio": 2000,
    },
    topReferrers: [
      { name: "Google", count: 3000 },
      { name: "Facebook", count: 1500 },
      { name: "Twitter", count: 500 },
    ],
  }

  return NextResponse.json(analytics)
}

