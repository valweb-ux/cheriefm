export const dynamic = "force-static"

export async function GET() {
  return new Response(
    JSON.stringify({
      data: [
        {
          id: "1",
          name: "Стандартний розклад",
          description: "Стандартний розклад на тиждень",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

