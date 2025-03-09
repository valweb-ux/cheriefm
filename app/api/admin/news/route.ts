export const dynamic = "force-static"

export async function GET() {
  return new Response(
    JSON.stringify({
      data: [
        {
          id: "1",
          title: "Новина 1",
          content: "Зміст новини 1",
          image: "/placeholder.svg?height=300&width=300",
          categoryId: "1",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Новина 2",
          content: "Зміст новини 2",
          image: "/placeholder.svg?height=300&width=300",
          categoryId: "2",
          published: true,
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

