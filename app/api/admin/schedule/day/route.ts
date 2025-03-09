export const dynamic = "force-static"

export async function GET() {
  return new Response(
    JSON.stringify({
      data: [
        {
          id: "1",
          programId: "1",
          title: "Ранкове шоу",
          start: "08:00",
          end: "10:00",
          day: 1,
          recurring: true,
        },
        {
          id: "2",
          programId: "2",
          title: "Музичний блок",
          start: "10:00",
          end: "12:00",
          day: 1,
          recurring: true,
        },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

